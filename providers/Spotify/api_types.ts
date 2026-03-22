export type SimplifiedAlbum = {
	id: string;
	type: 'album';
	href: string;
	name: string;
	uri: string;
	artists: SimplifiedArtist[];
	album_type: AlbumType;
	total_tracks: number;
	release_date: string;
	release_date_precision: ReleaseDatePrecision;
	external_urls: { spotify: string };
	images: Image[];
	/** The markets in which the album is available: ISO 3166-1 alpha-2 country codes. @deprecated Removed 2026-02. */
	available_markets?: string[];
	restrictions: { reason: string };
};

export type Album = SimplifiedAlbum & {
	tracks: ResultList<SimplifiedTrack>;
	copyrights: Copyright[];
	/** Known external IDs for the album. @deprecated Removed 2026-02. */
	external_ids?: ExternalIds;
	genres: string[];
	/** The label associated with the album. @deprecated Removed 2026-02. */
	label?: string;
	/**
	 * The popularity of the album. The value will be between 0 and 100, with 100 being the most popular.
	 * @deprecated Removed 2026-02.
	 */
	popularity?: number;
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
	is_playable: boolean | undefined;
	is_local: boolean;
	preview_url: string;
	/** Original track when relinked. @deprecated Removed 2026-02. */
	linked_from?: LinkedTrack | undefined;
	/**
	 * A list of the countries in which the track can be played, identified by their ISO 3166-1 alpha-2 code.
	 * @deprecated Removed 2026-02.
	 */
	available_markets?: string[];
	restrictions: { reason: string };
};

export type Track = SimplifiedTrack & {
	album: Album;
	artists: Artist[];
	/** Known external IDs for the track. @deprecated Removed 2026-02. */
	external_ids?: ExternalIds;
	/**
	 * The popularity of the track. The value will be between 0 and 100, with 100 being the most popular.
	 * @deprecated Removed 2026-02.
	 */
	popularity?: number;
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

export type BaseResultList = {
	href: string;
	limit: number;
	offset: number;
	total: number;
	next: string;
	previous: string;
};

export type TrackList = BaseResultList & {
	tracks: Track[];
};

export type ResultList<T> = BaseResultList & {
	items: T[];
};

export type SearchResult = {
	albums: ResultList<SimplifiedAlbum>;
	tracks: ResultList<SimplifiedTrack>;
	artists: ResultList<SimplifiedArtist>;
	// Unsupported / not needed:
	// Playlists: ResultList<Playlist>;
	// Shows: ResultList<Show>;
	// Episodes: ResultList<Episode>;
	// Audiobooks: ResultList<Audiobook>;
};

export type ApiError = {
	error: {
		status: number;
		message: string;
	};
};
