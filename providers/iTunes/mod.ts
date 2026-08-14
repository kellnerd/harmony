import { availableRegions } from './regions.ts';
import { type ApiAccessToken, type ApiQueryOptions, type CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { fillMediumsTracklistGaps } from '@/harmonizer/tracklist_gap.ts';
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { ProviderError } from '@/utils/errors.ts';
import { isEqualGTIN, isValidGTIN } from '@/utils/gtin.ts';
import { collectAmpTracks, extractAppleMusicJwt, extractScriptUrls, parseJwtExpiry, resolveAmpUrl } from './amp.ts';

import type { Collection, Kind, ReleaseResult, Track } from './api_types.ts';
import type { AmpAlbum, AmpDocument, AmpTrack } from './amp_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	ArtworkType,
	CountryCode,
	EntityId,
	GTIN,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	LinkType,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';
import type { ProviderCategory } from '@/providers/categories.ts';

// See https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI

export default class iTunesProvider extends MetadataApiProvider {
	readonly name = 'iTunes';

	readonly supportedUrls = new URLPattern({
		hostname: '{geo.}?(itunes|music).apple.com',
		pathname: String.raw`/:region(\w{2})?/:type(album|artist|song|music-video)/:slug?/{id}?:id(\d+)`,
	});

	override readonly categories = new Set<ProviderCategory>(['digital']);

	override readonly features: FeatureQualityMap = {
		'cover size': 3000,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.PRESENT,
		'MBID resolving': FeatureQuality.EXPENSIVE,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
		recording: ['song', 'music-video'],
	};

	override readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = iTunesReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2003,
		month: 4,
		day: 28,
	};

	readonly apiBaseUrl = 'https://itunes.apple.com';

	// Unofficial Apple Music catalog API used when iTunes Search omits streaming-only tracks.
	readonly ampApiBaseUrl = 'https://amp-api.music.apple.com';

	/** URLs without specified region implicitly query the US iTunes store. */
	readonly defaultRegion: CountryCode = 'US';

	constructUrl(entity: EntityId): URL {
		const region = entity.region ?? this.defaultRegion;
		return new URL([region.toLowerCase(), entity.type, entity.id].join('/'), 'https://music.apple.com');
	}

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const entity = super.extractEntityFromUrl(url);
		if (entity && !entity.region) {
			entity.region = this.defaultRegion;
		}
		return entity;
	}

	override getLinkTypesForEntity(): LinkType[] {
		// There is no way to appropriately determine this for an artist page.
		return ['paid streaming'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions = {}): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
			offline: options.offline,
		});
		return cacheEntry;
	}

	// Queries the Apple Music catalog (AMP) API.
	// Requires a MusicKit JWT and Origin: https://music.apple.com or AMP returns 401/403.
	async queryAmp<Data>(apiUrl: URL, options: ApiQueryOptions = {}): Promise<CacheEntry<Data>> {
		const accessToken = await this.cachedAccessToken(() => this.requestAmpAccessToken());
		return await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
			offline: options.offline,
			requestInit: {
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					// AMP rejects requests that do not look like they come from the Apple Music web app.
					'Origin': 'https://music.apple.com',
					'Accept': 'application/json',
				},
			},
		});
	}

	constructAmpAlbumUrl(albumId: string, region: CountryCode): URL {
		const url = new URL(`v1/catalog/${region.toLowerCase()}/albums/${albumId}`, this.ampApiBaseUrl);
		url.searchParams.set('include', 'tracks');
		return url;
	}

	// Loads an AMP album and follows `next` until the full tracklist is collected.
	async fetchAmpAlbum(
		albumId: string,
		region: CountryCode,
		options: ApiQueryOptions = {},
	): Promise<{ album: AmpAlbum; tracks: AmpTrack[]; timestamp: number }> {
		let nextUrl: URL | undefined = this.constructAmpAlbumUrl(albumId, region);
		let album: AmpAlbum | undefined;
		const tracks: AmpTrack[] = [];
		let timestamp = 0;

		while (nextUrl) {
			const cacheEntry: CacheEntry<AmpDocument> = await this.queryAmp(nextUrl, options);
			timestamp = Math.max(timestamp, cacheEntry.timestamp);
			const body: AmpDocument = cacheEntry.content;
			if (body.errors?.length) {
				const detail = body.errors.map((error) => error.detail ?? error.title).join('; ');
				throw new ProviderError(this.name, `Apple Music catalog API error: ${detail || 'unknown error'}`);
			}

			if (!album) {
				// First page is the album resource; later pages are additional tracks only.
				const albumResource = (body.data ?? []).find((resource): resource is AmpAlbum => resource.type === 'albums');
				if (!albumResource) {
					throw new ProviderError(this.name, 'Apple Music catalog API returned no album');
				}
				album = albumResource;
				tracks.push(...collectAmpTracks(body, album));
				const next = album.relationships?.tracks?.next ?? body.next;
				nextUrl = next ? resolveAmpUrl(next, this.ampApiBaseUrl) : undefined;
			} else {
				tracks.push(...collectAmpTracks(body));
				nextUrl = body.next ? resolveAmpUrl(body.next, this.ampApiBaseUrl) : undefined;
			}
		}

		return { album: album!, tracks, timestamp };
	}

	// AMP has no public client-credentials flow. The web app embeds a MusicKit JWT in
	// music.apple.com HTML or JS; scrape that token (not the album DOM) and cache it until `exp`.
	private async requestAmpAccessToken(): Promise<ApiAccessToken> {
		const pageUrl = new URL('https://music.apple.com');
		const page = await this.fetchSnapshot(pageUrl);
		const html = await page.content.text();
		const fromHtml = extractAppleMusicJwt(html);
		if (fromHtml) {
			return this.ampTokenFromJwt(fromHtml);
		}

		for (const scriptSrc of extractScriptUrls(html)) {
			const scriptUrl = new URL(scriptSrc, pageUrl);
			if (!scriptUrl.hostname.endsWith('apple.com') && !scriptUrl.hostname.endsWith('mzstatic.com')) {
				continue;
			}
			try {
				const script = await this.fetchSnapshot(scriptUrl);
				const fromScript = extractAppleMusicJwt(await script.content.text());
				if (fromScript) {
					return this.ampTokenFromJwt(fromScript);
				}
			} catch {
				// Try the next candidate script.
			}
		}

		throw new ProviderError(this.name, 'Failed to extract Apple Music catalog API token from music.apple.com');
	}

	private ampTokenFromJwt(accessToken: string): ApiAccessToken {
		return {
			accessToken,
			validUntilTimestamp: parseJwtExpiry(accessToken) ?? (Date.now() + 60 * 60 * 1000),
		};
	}
}

export class iTunesReleaseLookup extends ReleaseApiLookup<iTunesProvider, ReleaseResult> {
	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		const lookupUrl = new URL('lookup', this.provider.apiBaseUrl);
		const query = new URLSearchParams({
			entity: 'song', // include tracks of the release in the response
			limit: '200', // number of returned entities (default: 50; maximum: 200)
		});

		if (method === 'gtin') {
			query.append('upc', value);
		} else if (method === 'id') {
			query.append('id', value);
		}

		if (region) {
			query.append('country', region.toLowerCase());
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(): Promise<ReleaseResult> {
		if (!this.options.regions?.size) {
			this.options.regions = new Set([this.provider.defaultRegion]);
		}
		return await this.queryAllRegions<ReleaseResult>({
			isValidData: (data) => Boolean(data?.resultCount),
		});
	}

	protected async convertRawRelease(data: ReleaseResult): Promise<HarmonyRelease> {
		// API sometimes also returns other release variants for GTIN lookups, only use the first collection result.
		const collections = data.results.filter((result) => result.wrapperType === 'collection') as Collection[];
		let collection = collections[0];
		if (collections.length > 1 && this.lookup.method === 'gtin') {
			// Try to select the correct collection by GTIN instead, if applicable.
			const lookupGtin = this.lookup.value;
			collection = collections.find((candidate) => {
				const gtin = this.extractGTINFromUrl(candidate.artworkUrl100);
				return gtin ? isEqualGTIN(gtin, lookupGtin) : false;
			}) ?? collection;
		}
		this.entity = {
			id: collection.collectionId.toString(),
			type: 'album',
			region: this.lookup.region,
		};

		// Skip bonus items like booklets.
		const validTrackKinds: Kind[] = ['song', 'music-video'];
		const tracks = data.results.filter((result) =>
			result.wrapperType === 'track' && 'collectionId' in result && result.collectionId === collection.collectionId &&
			validTrackKinds.includes(result.kind)
		) as Track[];

		// iTunes Search often returns the collection but no songs for Apple Music–only DJ mixes.
		// Fall back to AMP for tracks and UPC & keep the iTunes collection for title/artist/cover.
		let ampTracks: AmpTrack[] = [];
		let ampUpc: string | undefined;
		if (!tracks.length) {
			this.addMessage('The API returned no tracks, which usually happens for streaming-only releases', 'warning');
			try {
				const amp = await this.provider.fetchAmpAlbum(
					collection.collectionId.toString(),
					this.lookup.region ?? this.provider.defaultRegion,
					{ snapshotMaxTimestamp: this.options.snapshotMaxTimestamp },
				);
				this.updateCacheTime(amp.timestamp);
				ampTracks = amp.tracks;
				ampUpc = amp.album.attributes?.upc;
				if (ampTracks.length) {
					this.addMessage(
						`Filled ${ampTracks.length} tracks from the Apple Music catalog API (iTunes Search API returned none)`,
					);
				} else {
					this.addMessage('Apple Music catalog API also returned no tracks', 'warning');
				}
			} catch (error) {
				const detail = error instanceof Error ? error.message : String(error);
				this.addMessage(`Apple Music catalog API fallback failed: ${detail}`, 'warning');
			}
		}

		// Warn about results which belong to a different collection.
		const skippedResults = data.results.filter((result) =>
			'collectionId' in result && result.collectionId !== collection.collectionId
		) as Array<Collection | Track>;
		if (skippedResults.length) {
			const uniqueSkippedIds = [...new Set(skippedResults.map((result) => result.collectionId))];
			const skippedUrls = uniqueSkippedIds.map((id) =>
				this.cleanViewUrl(skippedResults.find((result) => result.collectionId === id)!.collectionViewUrl)
			);
			this.warnMultipleResults(skippedUrls);
		}

		const { title, types } = this.getTypesFromTitle(collection.collectionName);

		const linkTypes: LinkType[] = [];
		if (collection.collectionPrice) {
			// A missing price might also indicate that the release date is in the future,
			// but then it is technically also not yet available for download.
			linkTypes.push('paid download');
		}
		if (
			ampTracks.length ||
			(tracks.length && tracks.every((track) => track.isStreamable || track.kind === 'music-video'))
		) {
			// All audio tracks should be streamable, music videos are always streamable but have no `isStreamable` property.
			linkTypes.push('paid streaming');
		}

		const releaseUrl = this.cleanViewUrl(collection.collectionViewUrl);
		const gtin = ampUpc && isValidGTIN(ampUpc) ? ampUpc : this.extractGTINFromUrl(collection.artworkUrl100);

		if (ampUpc && isValidGTIN(ampUpc)) {
			this.addMessage(`Successfully extracted GTIN ${ampUpc} from Apple Music catalog API`);
		} else if (!gtin) {
			this.addMessage('Failed to extract GTIN from artwork URL', 'warning');
		} else if (this.lookup.method === 'gtin' && !isEqualGTIN(gtin, this.lookup.value)) {
			this.addMessage(
				`Extracted GTIN ${gtin} (from artwork URL) does not match the looked up value ${this.lookup.value}`,
				'error',
			);
		} else {
			this.addMessage(`Successfully extracted GTIN ${gtin} from artwork URL`);
		}

		const release: HarmonyRelease = {
			title,
			artists: [this.convertRawArtist(collection.artistName, collection.artistViewUrl)],
			gtin: gtin,
			externalLinks: [{
				url: releaseUrl.href,
				types: linkTypes,
			}],
			media: ampTracks.length ? this.convertAmpTracklist(ampTracks) : this.convertRawTracklist(tracks),
			releaseDate: this.convertReleaseDate(parseISODateTime(collection.releaseDate)),
			status: 'Official',
			types,
			packaging: 'None',
			images: [this.processImage(collection.artworkUrl100, ['front'])],
			copyright: collection.copyright,
			info: this.generateReleaseInfo(),
		};

		return release;
	}

	private convertRawTracklist(tracklist: Track[]): HarmonyMedium[] {
		if (!tracklist.length) {
			return [];
		}

		const mediumCount = tracklist[0].discCount;
		const totalTrackCount = tracklist[0].trackCount;
		const media: HarmonyMedium[] = new Array(mediumCount).fill(null).map((_, index) => ({
			format: 'Digital Media',
			number: index + 1,
			tracklist: [],
		}));

		// split flat tracklist into media
		tracklist.forEach((track) => {
			const medium = media[track.discNumber - 1];

			// sometimes the censored name is not censored but more complete with extra title information
			let title = track.trackName;
			if (track.trackCensoredName.length > title.length) {
				title = track.trackCensoredName;
			}

			const linkTypes: LinkType[] = [];
			if (track.trackPrice) {
				linkTypes.push('paid download');
			}
			if (track.isStreamable || track.kind === 'music-video') {
				// Audio tracks should be streamable, music videos are always streamable but have no `isStreamable` property.
				linkTypes.push('paid streaming');
			}

			medium.tracklist.push({
				number: track.trackNumber,
				title,
				length: track.trackTimeMillis,
				artists: [this.convertRawArtist(track.artistName, track.artistViewUrl)],
				type: track.kind === 'music-video' ? 'video' : undefined,
				recording: {
					externalIds: this.provider.makeExternalIds({
						type: track.kind,
						id: track.trackId.toString(),
						region: this.lookup.region,
						linkTypes,
					}),
				},
			});
		});

		if (tracklist.length < totalTrackCount) {
			this.addMessage(
				`The API returned only ${tracklist.length} of ${totalTrackCount} tracks for ${this.lookup.region}, other regions may have more`,
				'warning',
			);
			fillMediumsTracklistGaps(media, totalTrackCount);
		}

		return media;
	}

	// Converts AMP catalog tracks (including ISRCs) into Harmony format.
	private convertAmpTracklist(tracklist: AmpTrack[]): HarmonyMedium[] {
		if (!tracklist.length) {
			return [];
		}

		const discCount = Math.max(1, ...tracklist.map((track) => track.attributes?.discNumber ?? 1));
		const media: HarmonyMedium[] = new Array(discCount).fill(null).map((_, index) => ({
			format: 'Digital Media',
			number: index + 1,
			tracklist: [],
		}));

		for (const track of tracklist) {
			const attributes = track.attributes;
			if (!attributes) continue;
			const discNumber = attributes.discNumber ?? 1;
			const medium = media[discNumber - 1];
			if (!medium) continue;

			const linkTypes: LinkType[] = ['paid streaming'];
			medium.tracklist.push({
				number: attributes.trackNumber,
				title: attributes.name,
				length: attributes.durationInMillis,
				artists: [this.convertRawArtist(attributes.artistName)],
				isrc: attributes.isrc,
				type: track.type === 'music-videos' ? 'video' : undefined,
				recording: {
					externalIds: this.provider.makeExternalIds({
						type: track.type === 'music-videos' ? 'music-video' : 'song',
						id: track.id,
						region: this.lookup.region,
						linkTypes,
					}),
				},
			});
		}

		return media;
	}

	private convertRawArtist(name: string, url?: string): ArtistCreditName {
		const artistId = url ? this.provider.extractEntityFromUrl(new URL(url)) : undefined;
		return {
			name,
			creditedName: name,
			externalIds: artistId ? this.provider.makeExternalIds(artistId) : undefined,
		};
	}

	private processImage(url: string, types?: ArtworkType[]): Artwork {
		return {
			url: getSourceImage(url).href,
			thumbUrl: url.replace('100x100bb', '250x250bb'),
			types,
		};
	}

	extractGTINFromUrl(url: string): GTIN | undefined {
		const gtinCandidate = url.match(/(?<!\d)\d{12,14}(?!\d)/)?.[0];
		if (gtinCandidate && isValidGTIN(gtinCandidate)) {
			return gtinCandidate;
		}
	}

	private cleanViewUrl(viewUrl: string) {
		// remove tracking(?) query parameters and blurb before ID
		// TODO: Generate canonical URL using `extractEntityFromUrl` and `constructUrl`.
		const url = new URL(viewUrl);
		url.search = '';
		url.pathname = url.pathname.replace(/(?<=\/(artist|album))\/[^/]+(?=\/\d+)/, '');

		return url;
	}

	private getTypesFromTitle(title: string): { title: string; types: ReleaseGroupType[] } {
		const re = /\s- (EP|Single)$/;
		const match = title.match(re);
		const types: ReleaseGroupType[] = [];
		if (match) {
			title = title.replace(re, '');
			types.push(match[1] as ReleaseGroupType);
		}

		return { title, types };
	}
}

/** Transform Apple image URL to point to the source image in its original resolution. */
export function getSourceImage(url: string) {
	const imageUrl = new URL(url);
	imageUrl.hostname = 'a1.mzstatic.com';
	imageUrl.pathname = imageUrl.pathname.replace(/^\/image\/thumb\//, '/us/r1000/063/');

	const pathComponents = imageUrl.pathname.split('/');
	const penultimate = pathComponents[pathComponents.length - 2];
	if (penultimate === 'source' || /\.(jpe?g|png|tiff?)$/.test(penultimate)) {
		// drop trailing path component which did the image conversion
		imageUrl.pathname = pathComponents.slice(0, -1).join('/');
	}

	return imageUrl;
}
