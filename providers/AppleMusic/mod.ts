import { availableRegions } from '../iTunes/regions.ts';
import {
	type ApiAccessToken,
	type ApiQueryOptions,
	type CacheEntry,
	MetadataApiProvider,
	ReleaseApiLookup,
} from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { getBooleanFromEnv, getFromEnv } from '@/utils/config.ts';
import { ProviderError } from '@/utils/errors.ts';
import { isValidGTIN } from '@/utils/gtin.ts';
import {
	catalogArtworkUrl,
	collectCatalogTracks,
	extractAppleMusicJwt,
	extractScriptUrls,
	parseJwtExpiry,
	resolveCatalogUrl,
} from './catalog.ts';

import type { CatalogAlbum, CatalogDocument, CatalogTrack } from './catalog_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	ArtworkType,
	CountryCode,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	LinkType,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';
import type { ProviderCategory } from '@/providers/categories.ts';

// Official catalog: https://developer.apple.com/documentation/applemusicapi
const officialApiBaseUrl = 'https://api.music.apple.com';
// Unofficial web catalog (AMP). Same JSON shape as the official API, used when no developer token is set.
const ampApiBaseUrl = 'https://amp-api.music.apple.com';

// Auth is one of: official JWT, AMP JWT, or scrape a MusicKit JWT from music.apple.com.
const officialToken = getFromEnv('HARMONY_APPLE_MUSIC_TOKEN') || '';
const ampToken = getFromEnv('HARMONY_APPLE_MUSIC_AMP_TOKEN') || '';
const scrapeToken = getBooleanFromEnv('HARMONY_APPLE_MUSIC_SCRAPE');

export type AppleMusicBackend = 'official' | 'amp';

export function isAppleMusicConfigured(): boolean {
	return Boolean(officialToken || ampToken || scrapeToken);
}

export function appleMusicBackend(): AppleMusicBackend {
	return officialToken ? 'official' : 'amp';
}

export default class AppleMusicProvider extends MetadataApiProvider {
	readonly name = 'Apple Music';

	// music.apple.com only; itunes.apple.com stays on the iTunes Search provider.
	readonly supportedUrls = new URLPattern({
		hostname: '{geo.}?music.apple.com',
		pathname: String.raw`/:region(\w{2})?/:type(album|artist|song|music-video)/:slug?/{id}?:id(\d+)`,
	});

	override readonly categories = new Set<ProviderCategory>(['digital']);

	override readonly features: FeatureQualityMap = {
		'cover size': 3000,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.GOOD,
		'MBID resolving': FeatureQuality.EXPENSIVE,
		'release label': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
		recording: ['song', 'music-video'],
	};

	override readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = AppleMusicReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2015,
		month: 6,
		day: 30,
	};

	// Official API if HARMONY_APPLE_MUSIC_TOKEN is set, otherwise AMP.
	readonly apiBaseUrl = officialToken ? officialApiBaseUrl : ampApiBaseUrl;

	readonly backend: AppleMusicBackend = appleMusicBackend();

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
		return ['paid streaming'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions = {}): Promise<CacheEntry<Data>> {
		// Both backends require a Bearer JWT; AMP also needs Origin (set below).
		const accessToken = await this.cachedAccessToken(() => this.requestAccessToken());
		const headers: Record<string, string> = {
			'Authorization': `Bearer ${accessToken}`,
			'Accept': 'application/json',
		};
		if (this.backend === 'amp') {
			// AMP rejects requests that do not look like they come from the Apple Music web app.
			headers['Origin'] = 'https://music.apple.com';
		}
		return await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
			offline: options.offline,
			requestInit: { headers },
		});
	}

	constructAlbumApiUrl(albumId: string, region: CountryCode): URL {
		const url = new URL(`v1/catalog/${region.toLowerCase()}/albums/${albumId}`, this.apiBaseUrl);
		url.searchParams.set('include', 'tracks');
		return url;
	}

	constructUpcSearchUrl(upc: string, region: CountryCode): URL {
		const url = new URL(`v1/catalog/${region.toLowerCase()}/albums`, this.apiBaseUrl);
		url.searchParams.set('filter[upc]', upc);
		return url;
	}

	// Loads a catalog album and follows `next` until the full tracklist is collected.
	async fetchCatalogAlbum(
		albumId: string,
		region: CountryCode,
		options: ApiQueryOptions = {},
	): Promise<{ album: CatalogAlbum; tracks: CatalogTrack[]; timestamp: number }> {
		let nextUrl: URL | undefined = this.constructAlbumApiUrl(albumId, region);
		let album: CatalogAlbum | undefined;
		const tracks: CatalogTrack[] = [];
		let timestamp = 0;

		while (nextUrl) {
			const cacheEntry: CacheEntry<CatalogDocument> = await this.query(nextUrl, options);
			timestamp = Math.max(timestamp, cacheEntry.timestamp);
			const body: CatalogDocument = cacheEntry.content;
			if (body.errors?.length) {
				const detail = body.errors.map((error) => error.detail ?? error.title).join('; ');
				throw new ProviderError(this.name, `Catalog API error: ${detail || 'unknown error'}`);
			}

			if (!album) {
				// First page is the album resource; later pages are additional tracks only.
				const albumResource = (body.data ?? []).find((resource): resource is CatalogAlbum =>
					resource.type === 'albums'
				);
				if (!albumResource) {
					throw new ProviderError(this.name, 'Catalog API returned no album');
				}
				album = albumResource;
				tracks.push(...collectCatalogTracks(body, album));
				const next = album.relationships?.tracks?.next ?? body.next;
				nextUrl = next ? resolveCatalogUrl(next, this.apiBaseUrl) : undefined;
			} else {
				tracks.push(...collectCatalogTracks(body));
				nextUrl = body.next ? resolveCatalogUrl(body.next, this.apiBaseUrl) : undefined;
			}
		}

		return { album: album!, tracks, timestamp };
	}

	private async requestAccessToken(): Promise<ApiAccessToken> {
		if (officialToken) {
			return this.tokenFromJwt(officialToken);
		}
		if (ampToken) {
			return this.tokenFromJwt(ampToken);
		}
		return await this.scrapeAccessToken();
	}

	// AMP has no public client-credentials flow. The web app embeds a MusicKit JWT in
	// music.apple.com HTML or JS; scrape that token (not the album DOM) and cache it until `exp`.
	private async scrapeAccessToken(): Promise<ApiAccessToken> {
		const pageUrl = new URL('https://music.apple.com');
		const page = await this.fetchSnapshot(pageUrl);
		const html = await page.content.text();
		const fromHtml = extractAppleMusicJwt(html);
		if (fromHtml) {
			return this.tokenFromJwt(fromHtml);
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
					return this.tokenFromJwt(fromScript);
				}
			} catch {
				// Try the next candidate script.
			}
		}

		throw new ProviderError(this.name, 'Failed to extract MusicKit token from music.apple.com');
	}

	private tokenFromJwt(accessToken: string): ApiAccessToken {
		return {
			accessToken,
			validUntilTimestamp: parseJwtExpiry(accessToken) ?? (Date.now() + 60 * 60 * 1000),
		};
	}
}

export class AppleMusicReleaseLookup extends ReleaseApiLookup<AppleMusicProvider, CatalogAlbum> {
	private tracks: CatalogTrack[] = [];

	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		const storefront = region ?? this.provider.defaultRegion;
		if (method === 'gtin') {
			return this.provider.constructUpcSearchUrl(value, storefront);
		}
		return this.provider.constructAlbumApiUrl(value, storefront);
	}

	protected async getRawRelease(): Promise<CatalogAlbum> {
		if (!this.options.regions?.size) {
			this.options.regions = new Set([this.provider.defaultRegion]);
		}

		// Catalog filter[upc] returns album IDs, not a full tracklist; fetch the album next.
		if (this.lookup.method === 'gtin') {
			const albumId = await this.queryAlbumIdByGtin(this.lookup.value);
			if (!albumId) {
				throw new ProviderError(this.provider.name, 'Catalog API returned no results for this GTIN');
			}
			this.lookup.method = 'id';
			this.lookup.value = albumId;
		}

		const region = this.lookup.region ?? this.provider.defaultRegion;
		const { album, tracks, timestamp } = await this.provider.fetchCatalogAlbum(
			this.lookup.value,
			region,
			{ snapshotMaxTimestamp: this.options.snapshotMaxTimestamp },
		);
		this.updateCacheTime(timestamp);
		this.tracks = tracks;
		this.entity = {
			id: album.id,
			type: 'album',
			region,
		};
		return album;
	}

	private async queryAlbumIdByGtin(gtin: string): Promise<string | undefined> {
		for (const region of this.options.regions || []) {
			this.lookup.region = region;
			const cacheEntry = await this.provider.query<CatalogDocument>(
				this.provider.constructUpcSearchUrl(gtin, region),
				{ snapshotMaxTimestamp: this.options.snapshotMaxTimestamp },
			);
			this.updateCacheTime(cacheEntry.timestamp);
			const albums = (cacheEntry.content.data ?? []).filter((resource): resource is CatalogAlbum =>
				resource.type === 'albums'
			);
			if (albums.length) {
				if (albums.length > 1) {
					this.warnMultipleResults(
						albums.slice(1).map((album) =>
							this.provider.constructUrl({
								type: 'album',
								id: album.id,
								region,
							})
						),
					);
				}
				return albums[0].id;
			}
		}
		return undefined;
	}

	protected convertRawRelease(album: CatalogAlbum): HarmonyRelease {
		const attributes = album.attributes;
		if (!attributes) {
			throw new ProviderError(this.provider.name, 'Album is missing attributes');
		}

		const { title, types } = this.getTypesFromTitle(attributes.name);
		const gtin = attributes.upc && isValidGTIN(attributes.upc) ? attributes.upc : undefined;
		const coverUrl = catalogArtworkUrl(attributes.artwork);
		const thumbUrl = catalogArtworkUrl(attributes.artwork, 250);

		this.addMessage(
			this.provider.backend === 'official'
				? 'Looked up via the official Apple Music API'
				: 'Looked up via the Apple Music catalog (AMP) API',
		);
		if (gtin) {
			this.addMessage(`Catalog UPC ${gtin}`);
		}

		const release: HarmonyRelease = {
			title,
			artists: [this.convertRawArtist(attributes.artistName)],
			gtin,
			externalLinks: [{
				url: this.provider.constructUrl(this.entity!).href,
				types: ['paid streaming'],
			}],
			media: this.convertTracklist(this.tracks),
			releaseDate: this.convertReleaseDate(
				attributes.releaseDate ? parseISODateTime(attributes.releaseDate) : undefined,
			),
			status: 'Official',
			types,
			packaging: 'None',
			images: coverUrl ? [this.processImage(coverUrl, thumbUrl, ['front'])] : undefined,
			copyright: attributes.copyright,
			labels: attributes.recordLabel ? [{ name: attributes.recordLabel }] : undefined,
			info: this.generateReleaseInfo(),
		};

		return release;
	}

	private convertTracklist(tracklist: CatalogTrack[]): HarmonyMedium[] {
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
						linkTypes: ['paid streaming'],
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
			externalIds: artistId?.type === 'artist' ? this.provider.makeExternalIds(artistId) : undefined,
		};
	}

	private processImage(url: string, thumbUrl: string | undefined, types?: ArtworkType[]): Artwork {
		return { url, thumbUrl, types };
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
