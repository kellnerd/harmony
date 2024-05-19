export type MinimalArtist = {
	/** The artist's Deezer id */
	id: number;
	name: string;
	/** API Link to the top of this artist */
	tracklist: string;
	type: string;
};

export type ReleaseArtist = MinimalArtist & Pictures;

export type TrackArtist = ReleaseArtist & {
	/** The url of the artist on Deezer */
	link: string;
	/** The share link of the artist on Deezer */
	share: string;
	/** true if the artist has a smartradio */
	radio: boolean;
};

export type Artist = TrackArtist & {
	/** The number of artist's albums */
	nb_album: number;
	/** The number of artist's fans */
	nb_fan: number;
};

export type Contributor = TrackArtist & {
	role: string;
};

export type ReleaseGenre = {
	id: number;
	name: string;
	picture: string;
	type: string;
};

export type Genre = ReleaseGenre & Pictures;

export type Pictures = {
	/** The url of the picture. Add 'size' parameter to the url to change size. Can be 'small', 'medium', 'big', 'xl' */
	picture: string;
	picture_small: string;
	picture_medium: string;
	picture_big: string;
	picture_xl: string;
};

export type MinimalRelease = {
	/** The Deezer album id */
	id: number;
	title: string;
	/** The url of the album on Deezer */
	link: string;
	/** The url of the album's cover. Add 'size' parameter to the url to change size. Can be 'small', 'medium', 'big', 'xl' */
	cover: string | '';
	cover_small: string | null;
	cover_medium: string | null;
	cover_big: string | null;
	cover_xl: string | null;
	md5_image: string;
	/** The album's release date */
	release_date: string;
	/** API Link to the tracklist of this album */
	tracklist: string;
	type: string;
};

export type Release = MinimalRelease & {
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

export type ReleaseTrack = {
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

export type TracklistItem = ReleaseTrack & {
	isrc: string;
	track_position: number;
	disk_number: number;
};

export type Track = TracklistItem & {
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

export type ApiError = {
	code: number;
	message: string;
	type: ErrorType;
};

export type ErrorType =
	| 'Exception'
	| 'OAuthException'
	| 'ParameterException'
	| 'MissingParameterException'
	| 'InvalidQueryException'
	| 'DataException'
	| 'IndividualAccountChangedNotAllowedException';

export type Result<T> = {
	data: T[];
	total: number;
	prev?: string;
	next?: string;
	error?: ApiError;
};
