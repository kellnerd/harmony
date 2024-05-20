import { availableRegions } from './regions.ts';
import { type CacheEntry, DurationPrecision, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { isEqualGTIN, isValidGTIN } from '@/utils/gtin.ts';
import { pluralWithCount } from '@/utils/plural.ts';

import type { Collection, ReleaseResult, Result, Track } from './api_types.ts';
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
} from '@/harmonizer/types.ts';

// See https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI

export default class iTunesProvider extends MetadataProvider {
	readonly name = 'iTunes';

	readonly supportedUrls = new URLPattern({
		hostname: '(itunes|music).apple.com',
		pathname: String.raw`/:region(\w{2})?/:type(album|artist)/:slug?/:id(\d+)`,
	});

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
	};

	readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = iTunesReleaseLookup;

	readonly launchDate: PartialDate = {
		year: 2003,
		month: 4,
		day: 28,
	};

	readonly durationPrecision = DurationPrecision.MS;

	readonly artworkQuality = 3000;

	readonly apiBaseUrl = 'https://itunes.apple.com';

	/** URLs without specified region implicitly query the US iTunes store. */
	readonly defaultRegion: CountryCode = 'US';

	constructUrl(entity: EntityId): URL {
		const region = entity.region ?? this.defaultRegion;
		return new URL([region.toLowerCase(), entity.type, entity.id].join('/'), 'https://music.apple.com');
	}

	extractEntityFromUrl(url: URL): EntityId | undefined {
		const entity = super.extractEntityFromUrl(url);
		if (entity && !entity.region) {
			entity.region = this.defaultRegion;
		}
		return entity;
	}

	async query<Data extends Result<unknown>>(
		apiUrl: URL,
		preferredRegions?: Set<CountryCode>,
		maxTimestamp?: number,
	): Promise<CacheEntry<Data>> {
		if (!preferredRegions?.size) {
			// Use the default region of the API (which would also be used if none was specified).
			preferredRegions = new Set([this.defaultRegion]);
		}

		const query = apiUrl.searchParams;

		for (const region of preferredRegions) {
			query.set('country', region.toLowerCase());
			apiUrl.search = query.toString();

			const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
				policy: { maxTimestamp },
			});
			if (cacheEntry.content.resultCount) {
				cacheEntry.region = region;
				return cacheEntry;
			}
		}

		throw new ResponseError(this.name, 'API returned no results', apiUrl);
	}
}

export class iTunesReleaseLookup extends ReleaseLookup<iTunesProvider, ReleaseResult> {
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
		const apiUrl = this.constructReleaseApiUrl();
		const { content, timestamp, region } = await this.provider.query<ReleaseResult>(
			apiUrl,
			this.options.regions,
			this.options.snapshotMaxTimestamp,
		);

		// Overwrite optional property with the actually used region (in order to build the accurate API URL).
		this.lookup.region = region;
		this.updateCacheTime(timestamp);

		return content;
	}

	protected convertRawRelease(data: ReleaseResult): HarmonyRelease {
		// API also returns other release variants for GTIN lookups, only use the first collection result
		const collection = data.results.find((result) => result.wrapperType === 'collection') as Collection;
		this.id = collection.collectionId.toString();
		const tracks = data.results.filter((result) =>
			// skip bonus items (e.g. booklets or videos)
			result.wrapperType === 'track' && result.kind === 'song' && result.collectionId === collection.collectionId
		) as Track[];

		// Warn about releases without returned tracks.
		if (!tracks.length) {
			this.addMessage(`The API returned no tracks, which usually happens for streaming-only releases`, 'warning');
		}

		// Warn about results which belong to a different collection.
		const skippedResults = data.results.filter((result) => result.collectionId !== collection.collectionId);
		if (skippedResults.length) {
			const uniqueSkippedIds = [...new Set(skippedResults.map((result) => result.collectionId))];
			const skippedUrls = uniqueSkippedIds.map((id) =>
				this.cleanViewUrl(skippedResults.find((result) => result.collectionId === id)!.collectionViewUrl)
			);
			this.addMessage(
				`The API also returned ${
					pluralWithCount(skippedUrls.length, 'other result, which was skipped', 'other results, which were skipped')
				}:\n- ${skippedUrls.join('\n- ')}`,
				'warning',
			);
		}

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

		return {
			title: collection.collectionName,
			artists: [this.convertRawArtist(collection.artistName, collection.artistViewUrl)],
			gtin: gtin,
			externalLinks: [{
				url: releaseUrl,
				types: linkTypes,
			}],
			media: this.convertRawTracklist(tracks),
			releaseDate: parseISODateTime(collection.releaseDate),
			status: 'Official',
			packaging: 'None',
			images: [this.processImage(collection.artworkUrl100, ['front'])],
			copyright: collection.copyright,
			info: this.generateReleaseInfo(),
		};
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
			url: getSourceImage(url),
			thumbUrl: new URL(url.replace('100x100bb', '250x250bb')),
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
