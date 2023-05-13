import { DurationPrecision, MetadataProvider } from './abstract.ts';
import { PartialDate, parseISODateTime } from '../utils/date.ts';

import type {
	ArtistCreditName,
	GTIN,
	HarmonyMedium,
	HarmonyRelease,
	LinkType,
	ReleaseOptions,
} from '../harmonizer/types.ts';

export default class iTunesProvider extends MetadataProvider<ReleaseResult> {
	readonly name = 'iTunes';

	readonly supportedUrls = new URLPattern({
		hostname: ':service(itunes|music).apple.com',
		pathname: String.raw`/:country(\w{2})?/album/:blurb?/:id(\d+)`,
	});

	readonly launchDate: PartialDate = {
		year: 2003,
		month: 4,
		day: 28,
	};

	readonly durationPrecision = DurationPrecision.MS;

	constructReleaseUrl(id: string): URL {
		return new URL(id, 'https://music.apple.com/album'); // TODO: region-specific URL
	}

	protected getRawReleaseById(id: string): Promise<ReleaseResult> {
		return this.query(`lookup?id=${id}&entity=song`);
	}

	protected getRawReleaseByGTIN(gtin: GTIN): Promise<ReleaseResult> {
		return this.query(`lookup?upc=${gtin}&entity=song`);
	}

	protected convertRawRelease(rawRelease: ReleaseResult, options?: ReleaseOptions): HarmonyRelease {
		const collection = rawRelease.results.find((result) => result.wrapperType === 'collection') as Collection;
		const tracks = rawRelease.results.filter((result) => result.wrapperType === 'track') as Track[];
		const linkTypes: LinkType[] = [];

		// TODO: check whether release is downloadable
		if (tracks.every((track) => track.isStreamable)) {
			linkTypes.push('paid streaming');
		}

		return {
			title: collection.collectionName,
			artists: [this.convertRawArtist(collection.artistName, collection.artistViewUrl)],
			gtin: '', // TODO: try to extract from cover art URL
			externalLinks: [{
				url: new URL(collection.collectionViewUrl), // TODO: clean url
				types: linkTypes,
			}],
			media: this.convertRawTracklist(tracks, tracks[0].discCount),
			releaseDate: parseISODateTime(collection.releaseDate),
			packaging: 'None',
			images: [{
				url: new URL(collection.artworkUrl100), // TODO: get larger image
				types: ['front'],
			}],
		};
	}

	private convertRawTracklist(tracklist: Track[], mediumCount: number): HarmonyMedium[] {
		const media: HarmonyMedium[] = new Array(mediumCount).fill(null).map((_, index) => ({
			format: 'Digital Media',
			number: index + 1,
			tracklist: [],
		}));

		// split flat tracklist into media
		tracklist.forEach((track) => {
			const medium = media[track.discNumber - 1];
			medium.tracklist.push({
				number: track.trackNumber,
				title: track.trackName,
				duration: track.trackTimeMillis,
				artists: [this.convertRawArtist(track.artistName, track.artistViewUrl)],
			});
		});

		return media;
	}

	private convertRawArtist(name: string, url: string): ArtistCreditName {
		return {
			name,
			externalLink: new URL(url), // TODO: clean url
		};
	}

	readonly apiBaseUrl = 'https://itunes.apple.com';

	private async query(path: string) {
		const apiUrl = new URL(path, this.apiBaseUrl); // TODO: region-specific URL
		const data = await this.fetchJSON(apiUrl);

		return data;
	}
}

type ReleaseResult = {
	resultCount: number;
	results: Array<Collection | Track>;
};

type Collection = {
	'wrapperType': 'collection';
	'collectionType': 'Album';
	'artistId': number;
	'collectionId': number;
	'amgArtistId': number;
	'artistName': string;
	'collectionName': string;
	'collectionCensoredName': string;
	'artistViewUrl': string;
	'collectionViewUrl': string;
	'artworkUrl60': string;
	'artworkUrl100': string;
	'collectionPrice': number;
	'collectionExplicitness': string;
	'contentAdvisoryRating': string;
	'trackCount': number;
	'copyright': string;
	'country': string;
	'currency': string;
	'releaseDate': string;
	'primaryGenreName': string;
};

type Track = {
	'wrapperType': 'track';
	'kind': 'song';
	'artistId': number;
	'collectionId': number;
	'trackId': number;
	'artistName': string;
	'collectionName': string;
	'trackName': string;
	'collectionCensoredName': string;
	'trackCensoredName': string;
	'artistViewUrl': string;
	'collectionViewUrl': string;
	'trackViewUrl': string;
	'previewUrl': string;
	'artworkUrl30': string;
	'artworkUrl60': string;
	'artworkUrl100': string;
	'collectionPrice': number;
	'trackPrice': number;
	'releaseDate': string;
	'collectionExplicitness': string;
	'trackExplicitness': string;
	'discCount': number;
	'discNumber': number;
	'trackCount': number;
	'trackNumber': number;
	'trackTimeMillis': number;
	'country': string;
	'currency': string;
	'primaryGenreName': string;
	'isStreamable': boolean;
};
