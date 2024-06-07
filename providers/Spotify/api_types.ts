export type Album = {
	id: string;
	type: 'album';
	href: string;
	name: string;
	uri: string;
	artists: SimplifiedArtist[];
	tracks: ResultList<SimplifiedTrack>;
	album_type: AlbumType;
	total_tracks: number;
	release_date: string;
	release_date_precision: ReleaseDatePrecision;
	external_urls: { spotify: string };
	images: Image[];
	available_markets: string[];
	restrictions: { reason: string };
	copyrights: Copyright[];
	external_ids: ExternalIds;
	genres: string[];
	label: string;
	/** The popularity of the album. The value will be between 0 and 100, with 100 being the most popular. */
	popularity: number;
};

export type SimplifiedArtist = {
	id: string;
	type: 'artist';
	href: string;
	name: string;
	uri: string;
};

export type Artist = SimplifiedArtist & {
	followers: { href: string; total: number };
};

export type LinkedTrack = {
	id: string;
	type: 'track';
	href: string;
	uri: string;
	external_urls: { spotify: string };
};

export type SimplifiedTrack = LinkedTrack & {
	name: string;
	artists: SimplifiedArtist[];
	track_number: number;
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	is_playable: boolean;
	is_local: boolean;
	preview_url: string;
	linked_from: LinkedTrack | undefined;
	available_markets: string[];
	restrictions: { reason: string };
};

export type Track = SimplifiedTrack & {
	album: Album;
	artists: Artist[];
	external_ids: ExternalIds;
	popularity: number;
};

export type Image = {
	url: string;
	width: number;
	height: number;
};

export type Copyright = {
	text: string;
	type: CopyrightType;
};

export type ExternalIds = {
	isrc: string;
	ean: string;
	upc: string;
};

export type ReleaseDatePrecision = 'year' | 'month' | 'day';

export type AlbumType = 'album' | 'single' | 'compilation';

export type CopyrightType = 'C' | 'P';

export type ResultList<T> = {
	href: string;
	limit: number;
	offset: number;
	total: number;
	next: string;
	previous: string;
	items: T[];
};

export type ApiError = {
	error: {
		status: number;
		message: string;
	};
};
