// Minimal types for the unofficial Apple Music catalog (AMP) API
// (https://amp-api.music.apple.com/v1/catalog/...).
// Not the public Apple Music AP, used as a fallback when iTunes Search returns no tracks.

export type AmpResourceType = 'albums' | 'songs' | 'music-videos' | 'artists';

export type AmpArtwork = {
	url: string;
	width?: number;
	height?: number;
};

export type AmpAlbumAttributes = {
	name: string;
	artistName: string;
	upc?: string;
	releaseDate?: string;
	copyright?: string;
	trackCount?: number;
	isComplete?: boolean;
	url?: string;
	artwork?: AmpArtwork;
};

export type AmpTrackAttributes = {
	name: string;
	artistName: string;
	durationInMillis?: number;
	trackNumber?: number;
	discNumber?: number;
	isrc?: string;
	url?: string;
};

export type AmpResource<Type extends AmpResourceType, Attributes> = {
	id: string;
	type: Type;
	attributes?: Attributes;
	relationships?: {
		tracks?: AmpRelationship<AmpTrack>;
		artists?: AmpRelationship<AmpArtist>;
	};
};

export type AmpAlbum = AmpResource<'albums', AmpAlbumAttributes>;
export type AmpTrack = AmpResource<'songs' | 'music-videos', AmpTrackAttributes>;
export type AmpArtist = AmpResource<'artists', { name: string; url?: string }>;

export type AmpRelationship<T> = {
	data?: T[];
	next?: string;
	href?: string;
};

export type AmpDocument = {
	data?: Array<AmpAlbum | AmpTrack | AmpArtist>;
	included?: Array<AmpAlbum | AmpTrack | AmpArtist>;
	next?: string;
	errors?: Array<{ title?: string; detail?: string; status?: string }>;
};
