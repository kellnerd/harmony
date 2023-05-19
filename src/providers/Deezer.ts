import { DurationPrecision, MetadataProvider, ProviderOptions } from './abstract.ts';
import { availableRegions } from './regions/Deezer.ts';
import { parseHyphenatedDate, PartialDate } from '../utils/date.ts';
import { ResponseError } from '../utils/errors.ts';

import type {
	ArtistCreditName,
	GTIN,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	ReleaseConverterOptions,
} from '../harmonizer/types.ts';

// See https://developers.deezer.com/api

export default class DeezerProvider extends MetadataProvider<Release> {
	constructor(options: ProviderOptions = {}) {
		super({
			rateLimitInterval: 5000,
			concurrentRequests: 50,
			...options,
		});
	}

	readonly name = 'Deezer';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.deezer.com',
		pathname: String.raw`/:country(\w{2})?/album/:id(\d+)`,
	});

	readonly availableRegions = availableRegions;

	readonly launchDate: PartialDate = {
		year: 2007,
		month: 8,
		day: 22,
	};

	readonly durationPrecision = DurationPrecision.SECONDS;

	readonly artworkQuality = 1400;

	constructReleaseUrl(id: string): URL {
		return new URL(id, 'https://www.deezer.com/album');
	}

	protected getRawReleaseById(albumId: string): Promise<Release> {
		return this.query(`album/${albumId}`);
	}

	private async getRawTracklist(albumId: string): Promise<TracklistItem[]> {
		const tracklist: TracklistItem[] = [];
		let nextPageQuery: string | undefined = `album/${albumId}/tracks`;

		while (nextPageQuery) {
			const response: Response<TracklistItem> = await this.query(nextPageQuery);
			tracklist.push(...response.data);
			nextPageQuery = response.next;
		}

		return tracklist;
	}

	protected getRawTrackById(trackId: string): Promise<Track> {
		return this.query(`track/${trackId}`);
	}

	protected getRawReleaseByGTIN(upc: GTIN): Promise<Release> {
		return this.query(`album/upc:${upc}`);
	}

	protected async convertRawRelease(rawRelease: Release, options: ReleaseConverterOptions): Promise<HarmonyRelease> {
		const needToFetchIndividualTracks = options.withAllTrackArtists || options.withAvailability || false;
		const needToFetchDetailedTracklist = !needToFetchIndividualTracks &&
			(options.withSeparateMedia || options.withISRC || false);

		let rawTracklist: Array<ReleaseTrack | TracklistItem | Track>;
		let media: HarmonyMedium[];

		if (needToFetchDetailedTracklist) {
			rawTracklist = await this.getRawTracklist(rawRelease.id.toString());
		} else {
			rawTracklist = rawRelease.tracks.data;

			if (needToFetchIndividualTracks) {
				// replace minimal tracklist with all available details for each track
				rawTracklist = await Promise.all(rawTracklist.map((track) => this.getRawTrackById(track.id.toString())));
			}
		}

		if (needToFetchDetailedTracklist || needToFetchIndividualTracks) {
			// we have enough info to split the tracklist into multiple media
			media = this.convertRawTracklist(rawTracklist as Array<TracklistItem | Track>);
		} else {
			media = [{
				format: 'Digital Media',
				tracklist: rawTracklist.map(this.convertRawTrack.bind(this)),
			}];
		}

		const releaseUrl = new URL(rawRelease.link);

		return {
			title: rawRelease.title,
			artists: rawRelease.contributors.map(this.convertRawArtist.bind(this)),
			gtin: rawRelease.upc,
			externalLinks: [{
				url: releaseUrl,
				types: ['free streaming'],
			}],
			media,
			releaseDate: parseHyphenatedDate(rawRelease.release_date),
			// split label string using slashes if the results have at least 3 characters
			labels: rawRelease.label.split(/(?<=[^/]{3,})\/(?=[^/]{3,})/).map((label) => ({
				name: label.trim(),
			})),
			status: 'Official',
			packaging: 'None',
			images: [{
				url: new URL(rawRelease.cover_xl),
				thumbUrl: new URL(rawRelease.cover_medium),
				types: ['front'],
			}],
			availableIn: this.determineAvailability(media),
			info: this.generateReleaseInfo(releaseUrl),
		};
	}

	private convertRawTracklist(tracklist: Array<TracklistItem | Track>): HarmonyMedium[] {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			tracklist: [],
		};

		// split flat tracklist into media
		tracklist.forEach((item, index) => {
			// store the previous medium and create a new one
			if (item.disk_number !== medium.number) {
				if (medium.number) {
					result.push(medium);
				}

				medium = {
					number: item.disk_number,
					format: 'Digital Media',
					tracklist: [],
				};
			}

			medium.tracklist.push(this.convertRawTrack(item, index));
		});

		// store the final medium
		result.push(medium);

		return result;
	}

	private convertRawTrack(track: ReleaseTrack | TracklistItem | Track, index: number): HarmonyTrack {
		const result: HarmonyTrack = {
			number: index + 1,
			title: track.title,
			duration: track.duration * 1000,
		};

		if ('isrc' in track) {
			// this is a detailed tracklist item
			result.isrc = track.isrc;
			result.number = track.track_position;
		}

		if ('contributors' in track) {
			// all available details about this track have been fetched
			result.artists = track.contributors.map(this.convertRawArtist);
			result.availableIn = track.available_countries;
		} else {
			result.artists = [this.convertRawArtist(track.artist)];
		}

		return result;
	}

	private convertRawArtist(artist: MinimalArtist): ArtistCreditName {
		return {
			name: artist.name,
			externalLink: new URL('https://www.deezer.com/artist/' + artist.id),
		};
	}

	private determineAvailability(media: HarmonyMedium[]): string[] | undefined {
		const trackAvailabilities = media.flatMap((medium) => medium.tracklist)
			.map((track) => new Set(track.availableIn));

		// calculate the intersection of all tracks' availabilities with Deezer's availability
		return this.availableRegions.filter((country) =>
			trackAvailabilities.every((availability) => availability?.has(country))
		);
	}

	readonly apiBaseUrl = 'https://api.deezer.com';

	private async query(path: string) {
		const apiUrl = new URL(path, this.apiBaseUrl);
		const data = await this.fetchJSON(apiUrl);

		if (data.error) {
			throw new DeezerResponseError(data.error, apiUrl);
		}
		return data;
	}
}

class DeezerResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		super('Deezer', `${details.message} (code ${details.code})`, url);
	}
}

type MinimalArtist = {
	/** The artist's Deezer id */
	id: number;
	name: string;
	/** API Link to the top of this artist */
	tracklist: string;
	type: string;
};

type ReleaseArtist = MinimalArtist & Pictures;

type TrackArtist = ReleaseArtist & {
	/** The url of the artist on Deezer */
	link: string;
	/** The share link of the artist on Deezer */
	share: string;
	/** true if the artist has a smartradio */
	radio: boolean;
};

type Artist = TrackArtist & {
	/** The number of artist's albums */
	nb_album: number;
	/** The number of artist's fans */
	nb_fan: number;
};

type Contributor = TrackArtist & {
	role: string;
};

type ReleaseGenre = {
	id: number;
	name: string;
	picture: string;
	type: string;
};

type Genre = ReleaseGenre & Pictures;

type Pictures = {
	/** The url of the picture. Add 'size' parameter to the url to change size. Can be 'small', 'medium', 'big', 'xl' */
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
};

type MinimalRelease = {
	/** The Deezer album id */
	id: number;
	title: string;
	/** The url of the album on Deezer */
	link: string;
	/** The url of the album's cover. Add 'size' parameter to the url to change size. Can be 'small', 'medium', 'big', 'xl' */
	cover: string;
	cover_small: string;
	cover_medium: string;
	cover_big: string;
	cover_xl: string;
	md5_image: string;
	/** The album's release date */
	release_date: string;
	/** API Link to the tracklist of this album */
	tracklist: string;
	type: string;
};

type Release = MinimalRelease & {
	upc: string;
	/** The share link of the album on Deezer */
	share: string;
	/** The album's first genre id (You should use the genre list instead). NB : -1 for not found */
	genre_id: number;
	genres: { data: ReleaseGenre[] };
	/** The album's label name */
	label: string;
	nb_tracks: number;
	/** The album's duration (seconds) */
	duration: number;
	/** The number of album's Fans */
	fans: number;
	rating: number; // missing from https://developers.deezer.com/api/album
	/** The record type of the album (EP / ALBUM / etc..)	 */
	record_type: string;
	available: boolean;
	/** Whether the album contains explicit lyrics */
	explicit_lyrics: boolean;
	/** The explicit content lyrics values (0:Not Explicit; 1:Explicit; 2:Unknown; 3:Edited; 4:Partially Explicit (Album "lyrics" only); 5:Partially Unknown (Album "lyrics" only); 6:No Advice Available; 7:Partially No Advice Available (Album "lyrics" only)) */
	explicit_content_lyrics: number;
	/** The explicit cover values (see `explicit_content_lyrics`) */
	explicit_content_cover: number;
	/** Return a list of contributors on the album */
	contributors: Contributor[];
	artist: ReleaseArtist;
	tracks: { data: ReleaseTrack[] };
};

type ReleaseTrack = {
	id: number;
	readable: boolean;
	title: string;
	title_short: string;
	title_version: string;
	link: string;
	duration: number;
	rank: string;
	explicit_lyrics: boolean;
	explicit_content_lyrics: number;
	explicit_content_cover: number;
	preview: string;
	md5_image: string;
	artist: MinimalArtist;
	type: string;
};

type TracklistItem = ReleaseTrack & {
	isrc: string;
	track_position: number;
	disk_number: number;
};

type Track = TracklistItem & {
	share: string;
	release_date: string;
	bpm: number;
	gain: number;
	available_countries: string[];
	contributors: Contributor[];
	artist: TrackArtist;
	album: MinimalRelease;
	type: string;
};

type ErrorType =
	| 'Exception'
	| 'OAuthException'
	| 'ParameterException'
	| 'MissingParameterException'
	| 'InvalidQueryException'
	| 'DataException'
	| 'IndividualAccountChangedNotAllowedException';

type ApiError = {
	code: number;
	message: string;
	type: ErrorType;
};

type Response<T> = {
	data: T[];
	total: number;
	prev?: string;
	next?: string;
	error?: ApiError;
};
