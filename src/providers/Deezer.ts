// See https://developers.deezer.com/api

export default class Deezer {
	static API_BASE_URL = 'https://api.deezer.com';

	static getRelease(albumId: string): Promise<Release> {
		return this.fetchJSON(`${this.API_BASE_URL}/album/${albumId}`);
	}

	static getTracklist(albumId: string): Promise<Tracklist> {
		return this.fetchJSON(`${this.API_BASE_URL}/album/${albumId}/tracks`);
	}

	static async fetchJSON(input: RequestInfo, init?: RequestInit) {
		let result = await fetch(input, init);
		return result.json();
	}
}


type MinimalArtist = {
	/** The artist's Deezer id */
	id: number
	name: string
	/** API Link to the top of this artist */
	tracklist: string
	type: string
}

type ReleaseArtist = MinimalArtist & Pictures

type TrackArtist = ReleaseArtist & {
	/** The url of the artist on Deezer */
	link: string
	/** The share link of the artist on Deezer */
	share: string
	/** true if the artist has a smartradio */
	radio: boolean
}

type Artist = TrackArtist & {
	/** The number of artist's albums */
	nb_album: number
	/** The number of artist's fans */
	nb_fan: number
}

type Contributor = TrackArtist & {
	role: string
}


type ReleaseGenre = {
	id: number
	name: string
	picture: string
	type: string
}

type Genre = ReleaseGenre & Pictures


type Pictures = {
	/** The url of the picture. Add 'size' parameter to the url to change size. Can be 'small', 'medium', 'big', 'xl' */
	picture: string
	picture_small: string
	picture_medium: string
	picture_big: string
	picture_xl: string
}


type MinimalRelease = {
	/** The Deezer album id */
	id: number
	title: string
	/** The url of the album on Deezer */
	link: string
	/** The url of the album's cover. Add 'size' parameter to the url to change size. Can be 'small', 'medium', 'big', 'xl' */
	cover: string
	cover_small: string
	cover_medium: string
	cover_big: string
	cover_xl: string
	md5_image: string
	/** The album's release date */
	release_date: string
	/** API Link to the tracklist of this album */
	tracklist: string
	type: string
}

type Release = MinimalRelease & {
	upc: string
	/** The share link of the album on Deezer */
	share: string
	/** The album's first genre id (You should use the genre list instead). NB : -1 for not found */
	genre_id: number
	genres: { data: ReleaseGenre[] }
	/** The album's label name */
	label: string
	nb_tracks: number
	/** The album's duration (seconds) */
	duration: number
	/** The number of album's Fans */
	fans: number
	rating: number // missing from https://developers.deezer.com/api/album
	/** The record type of the album (EP / ALBUM / etc..)	 */
	record_type: string
	available: boolean
	/** Whether the album contains explicit lyrics */
	explicit_lyrics: boolean
	/** The explicit content lyrics values (0:Not Explicit; 1:Explicit; 2:Unknown; 3:Edited; 4:Partially Explicit (Album "lyrics" only); 5:Partially Unknown (Album "lyrics" only); 6:No Advice Available; 7:Partially No Advice Available (Album "lyrics" only)) */
	explicit_content_lyrics: number
	/** The explicit cover values (see `explicit_content_lyrics`) */
	explicit_content_cover: number
	/** Return a list of contributors on the album */
	contributors: Contributor[]
	artist: ReleaseArtist
	tracks: { data: ReleaseTrack[] }
}


type ReleaseTrack = {
	id: number
	readable: boolean
	title: string
	title_short: string
	title_version: string
	link: string
	duration: string
	rank: string
	explicit_lyrics: boolean
	explicit_content_lyrics: number
	explicit_content_cover: number
	preview: string
	md5_image: string
	artist: MinimalArtist
	type: string
}

type TracklistItem = ReleaseTrack & {
	isrc: string
	track_position: number
	disk_number: number
}

type Tracklist = {
	data: TracklistItem[]
	total: number
}

type Track = TracklistItem & {
	share: string
	release_date: string
	bpm: number
	gain: number
	available_countries: string[]
	contributors: Contributor[]
	artist: TrackArtist
	album: MinimalRelease
	type: string
}
