export type Artist = {
	wrapperType: 'artist';
	artistType: 'Artist';
	artistName: string;
	artistLinkUrl: string;
	artistId: number;
	amgArtistId: number;
	primaryGenreName: string;
	primaryGenreId: number;
};

export type Collection = {
	wrapperType: 'collection';
	collectionType: 'Album';
	artistId: number;
	collectionId: number;
	amgArtistId: number;
	artistName: string;
	collectionName: string;
	collectionCensoredName: string;
	// Various artists have no URL
	artistViewUrl?: string;
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

/** Standalone track which is not associated to any collection/release. */
export type StandaloneTrack = {
	wrapperType: 'track';
	kind: Kind;
	artistId: number;
	trackId: number;
	artistName: string;
	trackName: string;
	trackCensoredName: string;
	artistViewUrl: string;
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
	trackTimeMillis: number;
	country: string;
	currency: string;
	primaryGenreName: string;
	isStreamable?: boolean;
};

export type Track = {
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
	isStreamable?: boolean;
};

export type Explicitness = 'clean' | 'explicit' | 'notExplicit';

export type Kind =
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

export type Result<T> = {
	resultCount: number;
	results: Array<T>;
};

export type ReleaseResult = Result<Collection | Track | StandaloneTrack>;
