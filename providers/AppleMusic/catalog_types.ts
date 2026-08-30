// Types shared by the official Apple Music API and AMP
// (https://api.music.apple.com/v1/catalog/... and https://amp-api.music.apple.com/v1/catalog/...).

export type CatalogResourceType = 'albums' | 'songs' | 'music-videos' | 'artists';

export type CatalogArtwork = {
	url: string;
	width?: number;
	height?: number;
};

export type CatalogAlbumAttributes = {
	name: string;
	artistName: string;
	upc?: string;
	releaseDate?: string;
	copyright?: string;
	recordLabel?: string;
	trackCount?: number;
	isComplete?: boolean;
	url?: string;
	artwork?: CatalogArtwork;
};

export type CatalogTrackAttributes = {
	name: string;
	artistName: string;
	durationInMillis?: number;
	trackNumber?: number;
	discNumber?: number;
	isrc?: string;
	url?: string;
};

export type CatalogResource<Type extends CatalogResourceType, Attributes> = {
	id: string;
	type: Type;
	attributes?: Attributes;
	relationships?: {
		tracks?: CatalogRelationship<CatalogTrack>;
		artists?: CatalogRelationship<CatalogArtist>;
	};
};

export type CatalogAlbum = CatalogResource<'albums', CatalogAlbumAttributes>;
export type CatalogTrack = CatalogResource<'songs' | 'music-videos', CatalogTrackAttributes>;
export type CatalogArtist = CatalogResource<'artists', { name: string; url?: string }>;

export type CatalogRelationship<T> = {
	data?: T[];
	next?: string;
	href?: string;
};

export type CatalogDocument = {
	data?: Array<CatalogAlbum | CatalogTrack | CatalogArtist>;
	included?: Array<CatalogAlbum | CatalogTrack | CatalogArtist>;
	next?: string;
	errors?: Array<{ title?: string; detail?: string; status?: string }>;
};
