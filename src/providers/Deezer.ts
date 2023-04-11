import MetadataProvider from './abstract.ts';
import { DurationPrecision } from './common.ts';
import { ResponseError } from '../errors.ts';

import type { GTIN, HarmonyMedium, HarmonyRelease, HarmonyTrack, ReleaseOptions } from './common.ts';

// See https://developers.deezer.com/api

export default class DeezerProvider extends MetadataProvider<Release> {
	readonly name = 'Deezer';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.deezer.com',
		pathname: String.raw`/:country(\w{2})?/album/:id(\d+)`,
	});

	readonly durationPrecision = DurationPrecision.SECONDS;

	constructReleaseUrl(id: string): URL {
		return new URL('https://www.deezer.com/album/' + id);
	}

	getRawReleaseById(albumId: string): Promise<Release> {
		return this.query(`album/${albumId}`);
	}

	getRawTracklist(albumId: string): Promise<Response<TracklistItem>> {
		return this.query(`album/${albumId}/tracks`);
	}

	getRawReleaseByGTIN(upc: GTIN): Promise<Release> {
		return this.query(`album/upc:${upc}`);
	}

	async convertRawRelease(rawRelease: Release, options?: ReleaseOptions): Promise<HarmonyRelease> {
		let media: HarmonyMedium[];

		if (options?.withSeparateMedia || options?.withISRC) {
			const rawTracklist = await this.getRawTracklist(rawRelease.id.toString());
			media = convertRawTracklist(rawTracklist.data);
		} else {
			media = [{
				tracklist: rawRelease.tracks.data.map(convertRawTrack),
			}];
		}

		return {
			title: rawRelease.title,
			gtin: rawRelease.upc,
			externalLink: new URL(rawRelease.link),
			media,
		};
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

function convertRawTracklist(tracklist: TracklistItem[]): HarmonyMedium[] {
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
				tracklist: [],
			};
		}

		medium.tracklist.push(convertRawTrack(item, index));
	});

	// store the final medium
	result.push(medium);

	return result;
}

function convertRawTrack(track: ReleaseTrack | TracklistItem, index: number): HarmonyTrack {
	const result: HarmonyTrack = {
		number: index + 1,
		title: track.title,
		duration: track.duration * 1000,
	};

	if ('isrc' in track) { // this is a detailed tracklist item
		result.isrc = track.isrc;
		result.number = track.track_position;
	}

	return result;
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
