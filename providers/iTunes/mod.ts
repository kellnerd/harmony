import { availableRegions } from './regions.ts';
import { type CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { isEqualGTIN, isValidGTIN } from '@/utils/gtin.ts';

import type { Collection, Kind, ReleaseResult, Track } from './api_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	ArtworkType,
	CountryCode,
	EntityId,
	GTIN,
	HarmonyMedium,
	HarmonyRelease,
	LinkType,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';

// See https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI

export default class iTunesProvider extends MetadataApiProvider {
	readonly name = 'iTunes';

	readonly supportedUrls = new URLPattern({
		hostname: '{geo.}?(itunes|music).apple.com',
		pathname: String.raw`/:region(\w{2})?/:type(album|artist|song)/:slug?/{id}?:id(\d+)`,
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 3000,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.PRESENT,
		'MBID resolving': FeatureQuality.EXPENSIVE,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
	};

	override readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = iTunesReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2003,
		month: 4,
		day: 28,
	};

	readonly apiBaseUrl = 'https://itunes.apple.com';

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

	async query<Data>(apiUrl: URL, maxTimestamp?: number): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp },
		});
		return cacheEntry;
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
		const isValidData = (data: ReleaseResult) => {
			return Boolean(data?.resultCount);
		};
		return await this.queryAllRegions<ReleaseResult>(isValidData);
	}

	protected convertRawRelease(data: ReleaseResult): HarmonyRelease {
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
			result.wrapperType === 'track' && result.collectionId === collection.collectionId &&
			validTrackKinds.includes(result.kind)
		) as Track[];

		// Warn about releases without returned tracks.
		if (!tracks.length) {
			this.addMessage('The API returned no tracks, which usually happens for streaming-only releases', 'warning');
		}

		// Warn about results which belong to a different collection.
		const skippedResults = data.results.filter((result) => result.collectionId !== collection.collectionId);
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
		if (tracks.every((track) => track.isStreamable)) {
			linkTypes.push('paid streaming');
		}

		const releaseUrl = this.cleanViewUrl(collection.collectionViewUrl);
		const gtin = this.extractGTINFromUrl(collection.artworkUrl100);

		if (!gtin) {
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
			media: this.convertRawTracklist(tracks),
			releaseDate: parseISODateTime(collection.releaseDate),
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

			medium.tracklist.push({
				number: track.trackNumber,
				title,
				length: track.trackTimeMillis,
				artists: [this.convertRawArtist(track.artistName, track.artistViewUrl)],
				type: track.kind === 'music-video' ? 'video' : undefined,
				recording: {
					externalIds: this.provider.makeExternalIds({
						type: 'song',
						id: track.trackId.toString(),
						region: this.lookup.region,
					}),
				},
			});
		});

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
