import { DurationPrecision, MetadataProvider } from './abstract.ts';
import { parseISODateTime, PartialDate } from '../utils/date.ts';
import { ResponseError } from '../utils/errors.ts';
import { isValidGTIN } from '../utils/gtin.ts';
import { pluralWithCount } from '../utils/plural.ts';

import type {
	ArtistCreditName,
	Artwork,
	ArtworkType,
	CountryCode,
	GTIN,
	HarmonyMedium,
	HarmonyRelease,
	LinkType,
	ProviderMessage,
	RawReleaseOptions,
	RawResult,
} from '../harmonizer/types.ts';

export default class iTunesProvider extends MetadataProvider<ReleaseResult> {
	readonly name = 'iTunes';

	readonly supportedUrls = new URLPattern({
		hostname: '(itunes|music).apple.com',
		pathname: String.raw`/:country(\w{2})?/album/:blurb?/:id(\d+)`,
	});

	readonly launchDate: PartialDate = {
		year: 2003,
		month: 4,
		day: 28,
	};

	readonly durationPrecision = DurationPrecision.MS;

	readonly artworkQuality = 3000;

	readonly apiBaseUrl = 'https://itunes.apple.com';

	constructReleaseUrl(id: string, region: CountryCode = 'US'): URL {
		return new URL([region.toLowerCase(), 'album', id].join('/'), 'https://music.apple.com');
	}

	constructReleaseApiUrl({ lookup }: RawReleaseOptions): URL | undefined {
		const lookupUrl = new URL('lookup', this.apiBaseUrl);
		const query = new URLSearchParams({
			entity: 'song', // include tracks of the release in the response
		});

		if (lookup.method === 'gtin') {
			query.append('upc', lookup.value);
		} else if (lookup.method === 'id') {
			query.append('id', lookup.value);
		}

		if (lookup.region) {
			query.append('country', lookup.region.toLowerCase());
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(options: RawReleaseOptions): Promise<RawResult<ReleaseResult>> {
		const apiUrl = this.constructReleaseApiUrl(options)!;
		const data = await this.query(apiUrl, options?.regions) as ReleaseResult;

		return {
			data,
			lookupInfo: {
				...options.lookup,
				region: data.region, // the region which has actually been used successfully
			},
		};
	}

	protected convertRawRelease(
		{ data, lookupInfo }: RawResult<ReleaseResult>,
		options: RawReleaseOptions,
	): HarmonyRelease {
		const messages: ProviderMessage[] = [];

		// API also returns other release variants for GTIN lookups, only use the first collection result
		const collection = data.results.find((result) => result.wrapperType === 'collection') as Collection;
		const tracks = data.results.filter((result) =>
			// skip bonus items (e.g. booklets or videos)
			result.wrapperType === 'track' && result.kind === 'song' && result.collectionId === collection.collectionId
		) as Track[];

		// warn about results which belong to a different collection
		const skippedResults = data.results.filter((result) => result.collectionId !== collection.collectionId);
		if (skippedResults.length) {
			const uniqueSkippedIds = [...new Set(skippedResults.map((result) => result.collectionId))];
			const skippedUrls = uniqueSkippedIds.map((id) =>
				this.cleanViewUrl(skippedResults.find((result) => result.collectionId === id)!.collectionViewUrl)
			);
			messages.push(this.generateMessage(
				`API also returned ${
					pluralWithCount(skippedUrls.length, 'other result, which was skipped', 'other results, which were skipped')
				}: ${skippedUrls.join(', ')}`,
				'warning',
			));
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
			messages.push(this.generateMessage('Failed to extract GTIN from artwork URL', 'warning'));
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
			info: this.generateReleaseInfo({ id: collection.collectionId.toString(), lookupInfo, messages, options }),
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
				duration: track.trackTimeMillis,
				artists: [this.convertRawArtist(track.artistName, track.artistViewUrl)],
			});
		});

		return media;
	}

	private convertRawArtist(name: string, url: string): ArtistCreditName {
		return {
			name,
			externalLink: this.cleanViewUrl(url),
		};
	}

	private processImage(url: string, types?: ArtworkType[]): Artwork {
		// transform image URL to point to the source image in its original resolution
		const imageUrl = new URL(url);
		imageUrl.hostname = 'a1.mzstatic.com';
		imageUrl.pathname = imageUrl.pathname.replace(/^\/image\/thumb\//, '/us/r1000/063/');
		const pathComponents = imageUrl.pathname.split('/');
		if (pathComponents.length === 12) {
			// drop trailing path component which did the image conversion
			imageUrl.pathname = pathComponents.slice(0, -1).join('/');
		}

		return {
			url: imageUrl,
			thumbUrl: new URL(url.replace('100x100bb', '250x250bb')),
			types,
		};
	}

	extractGTINFromUrl(url: string): GTIN | undefined {
		const gtinCandidate = url.match(/\b\d{12,14}\b/)?.[0];
		if (gtinCandidate && isValidGTIN(gtinCandidate)) {
			return gtinCandidate;
		}
	}

	private cleanViewUrl(viewUrl: string) {
		// remove tracking(?) query parameters and blurb before ID
		const url = new URL(viewUrl);
		url.search = '';
		url.pathname = url.pathname.replace(/(?<=\/(artist|album))\/[^/]+(?=\/\d+)/, '');

		return url;
	}

	private async query<T>(apiUrl: URL, preferredRegions?: CountryCode[]) {
		if (!preferredRegions?.length) {
			// use the default region of the API (which would also be used if none was specified)
			preferredRegions = ['US'];
		}

		const query = apiUrl.searchParams;

		for (const region of preferredRegions) {
			query.set('country', region);
			apiUrl.search = query.toString();

			const data = await this.fetchJSON(apiUrl) as Result<T>;
			if (data.resultCount) {
				data.region = region;
				return data;
			}
		}

		throw new ResponseError(this.name, 'API returned no results', apiUrl!);
	}
}

type Result<T> = {
	resultCount: number;
	results: Array<T>;
	/** Custom property to remember the successfully queried region of the API. */
	region: CountryCode;
};

type ReleaseResult = Result<Collection | Track>;

type Collection = {
	wrapperType: 'collection';
	collectionType: 'Album';
	artistId: number;
	collectionId: number;
	amgArtistId: number;
	artistName: string;
	collectionName: string;
	collectionCensoredName: string;
	artistViewUrl: string;
	collectionViewUrl: string;
	artworkUrl60: string;
	artworkUrl100: string;
	collectionPrice?: number;
	collectionExplicitness: Explicitness;
	contentAdvisoryRating?: 'Explicit';
	trackCount: number;
	copyright: string;
	country: string;
	currency: string;
	releaseDate: string;
	primaryGenreName: string;
};

type Track = {
	wrapperType: 'track';
	kind: Kind;
	artistId: number;
	collectionId: number;
	trackId: number;
	artistName: string;
	collectionName: string;
	trackName: string;
	collectionCensoredName: string;
	trackCensoredName: string;
	artistViewUrl: string;
	collectionViewUrl: string;
	trackViewUrl: string;
	previewUrl: string;
	artworkUrl30: string;
	artworkUrl60: string;
	artworkUrl100: string;
	collectionPrice: number;
	trackPrice: number;
	releaseDate: string;
	collectionExplicitness: Explicitness;
	trackExplicitness: Explicitness;
	discCount: number;
	discNumber: number;
	trackCount: number;
	trackNumber: number;
	trackTimeMillis: number;
	country: string;
	currency: string;
	primaryGenreName: string;
	isStreamable: boolean;
};

type Explicitness = 'clean' | 'explicit' | 'notExplicit';

type Kind =
	| 'album'
	| 'artist'
	| 'book'
	| 'coached-audio'
	| 'feature-movie'
	| 'interactive-booklet'
	| 'music-video'
	| 'pdf podcast'
	| 'podcast-episode'
	| 'software-package'
	| 'song'
	| 'tv-episode';
