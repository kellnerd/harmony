export type SingleDataDocument<T> = {
	data: T;
	links: ResourceLinks;
	included: IncludedResource[];
};

export type MultiDataDocument<T> = {
	data: T[];
	links: ResourceLinks;
	included: IncludedResource[];
};

export type IncludedResource =
	| AlbumsResource
	| ArtistsResource
	| ArtworksResource
	| TracksResource
	| VideosResource
	| ProvidersResource;

// FIXME: complete list?
export type ResourceType = IncludedResource['type'];

export type ResourceTypeMap = {
	albums: AlbumsResource;
	artists: ArtistsResource;
	artworks: ArtworksResource;
	providers: ProvidersResource;
	tracks: TracksResource;
	videos: VideosResource;
};

export type Availability = 'STREAM' | 'DJ' | 'STEM';

export type AlbumsResource = {
	/** The Tidal ID */
	id: string;
	type: 'albums';
	attributes: AlbumsAttributes;
	relationships: AlbumsRelationships;
	links: ResourceLinks;
};

export type AlbumsAttributes = {
	title: string;
	barcodeId: string;
	numberOfVolumes: number;
	numberOfItems: number;
	/** ISO-8601 duration (e.g. P41M5S) */
	duration: string;
	explicit: boolean;
	/** Release date in YYYY-MM-DD format */
	releaseDate: string;
	/** Copyright text. No longer a plain string since 2025-09-06. */
	copyright?: string | { text: string };
	/** Album popularity (ranged in 0.00 ... 1.00). Conditionally visible */
	popularity: number;
	/** Defines an album availability e.g. for streaming, DJs, stems */
	availability: Availability[];
	mediaTags: string[];
	/** @deprecated Removed 2025-06-17 (without announcement). */
	imageLinks?: MediaLink[];
	/** @deprecated Removed 2025-06-17 (without announcement). */
	videoLinks?: MediaLink[];
	externalLinks: ExternalLink[];
	type: 'ALBUM' | 'EP' | 'SINGLE';
};

export type AlbumsRelationships = {
	artists: MultiDataRelationship<'artists'>;
	similarAlbums: MultiDataRelationship<'albums'>;
	/** Replaces {@linkcode AlbumsAttributes.imageLinks} and {@linkcode AlbumsAttributes.videoLinks}. */
	coverArt?: MultiDataRelationship<'artworks'>;
	items: AlbumItemMultiDataRelationship;
	providers: MultiDataRelationship<'providers'>;
};

export type ArtistsResource = {
	/** The Tidal ID */
	id: string;
	type: 'artists';
	attributes: ArtistsAttributes;
	relationships: ArtistsRelationships;
	links: ResourceLinks;
};

export type ArtistRoles = 'ARTIST' | 'SONGWRITER' | 'ENGINEER' | 'PRODUCTION_TEAM' | 'PERFORMER' | 'PRODUCER' | 'MISC';

export type ArtistsAttributes = {
	name: string;
	popularity: number;
	imageLinks: MediaLink[];
	externalLinks: ExternalLink[];
	roles: ArtistRoles[];
};

export type ArtistsRelationships = {
	similarArtists: MultiDataRelationship<'artists'>;
	albums: MultiDataRelationship<'albums'>;
	roles: MultiDataRelationship;
	videos: MultiDataRelationship<'videos'>;
	// trackProviders: ArtistTrackProvidersMultiDataRelationship; // FIXME
	tracks: MultiDataRelationship<'tracks'>;
	radio: MultiDataRelationship;
};

export type ArtworksResource = {
	id: string;
	type: 'artworks';
	attributes: ArtworksAttributes;
};

export type ArtworksAttributes = {
	/** Media type of artwork files */
	mediaType: 'IMAGE' | 'VIDEO';
	files: MediaLink[];
};

export type TracksResource = {
	/** The Tidal ID */
	id: string;
	type: 'tracks';
	attributes: TracksAttributes;
	relationships: TracksRelationships;
	links: ResourceLinks;
};

export type TracksAttributes = {
	title: string;
	/**
	 * Version information, displayed as extra title information in parentheses after the title.
	 * Optional attribute that is often `null`, but may be missing in older responses.
	 */
	version?: string | null;
	isrc: string;
	/** ISO-8601 duration (e.g. P41M5S) */
	duration: string;
	/** Copyright text. */
	copyright: string;
	explicit: boolean;
	/** Track popularity (ranged in 0.00 ... 1.00). Conditionally visible */
	popularity: number;
	/** Defines a catalog item availability e.g. for streaming, DJs, stems */
	availability: Availability[];
	mediaTags: string[];
	externalLinks: ExternalLink[];
};

export type TracksRelationships = {
	albums: MultiDataRelationship<'albums'>;
	artists: MultiDataRelationship<'artists'>;
	similarTracks: MultiDataRelationship<'tracks'>;
	providers: MultiDataRelationship<'providers'>;
	radio: MultiDataRelationship;
};

export type VideosResource = {
	/** The Tidal ID */
	id: string;
	type: 'videos';
	attributes: VideosAttributes;
	relationships: VideosRelationships;
	links: ResourceLinks;
};

export type VideosAttributes = TracksAttributes & {
	releaseDate: string;
	imageLinks: MediaLink[];
};

export type VideosRelationships = {
	albums: MultiDataRelationship<'albums'>;
	artists: MultiDataRelationship<'artists'>;
	/** Replaces {@linkcode AlbumsAttributes.imageLinks} and {@linkcode AlbumsAttributes.videoLinks}. */
	thumbnailArt?: MultiDataRelationship<'artworks'>;
	providers: MultiDataRelationship<'providers'>;
};

export type ProvidersResource = {
	/** The Tidal ID */
	id: string;
	type: 'providers';
	attributes: ProvidersAttributes;
	links: ResourceLinks;
};

export type ProvidersAttributes = {
	name: string;
};

export type MultiDataRelationship<T extends ResourceType = ResourceType> = {
	data: ResourceIdentifier<T>[];
	links: ResourceLinks;
};

export type ResourceIdentifier<T extends ResourceType = ResourceType> = {
	id: string;
	type: T;
};

export type ResourceLinks = {
	/** the link that generated the current response document */
	self: string;
	/** the next page of data (pagination) */
	next?: string;
};

export type AlbumItemMultiDataRelationship = {
	data: AlbumItemResourceIdentifier[];
	links: ResourceLinks;
};

export type AlbumItemResourceIdentifier = ResourceIdentifier<'tracks' | 'videos'> & {
	meta: AlbumItemResourceIdentifierMeta;
};

export type AlbumItemResourceIdentifierMeta = {
	volumeNumber: number;
	trackNumber: number;
};

export type MediaLink = {
	href: string;
	meta: MediaLinkMeta;
};

export type MediaLinkMeta = {
	width: number;
	height: number;
};

export type ExternalLink = {
	href: string;
	meta: ExternalLinkMeta;
};

export type ExternalLinkMeta = {
	type:
		| 'TIDAL_SHARING'
		| 'TIDAL_AUTOPLAY_ANDROID'
		| 'TIDAL_AUTOPLAY_IOS'
		| 'TIDAL_AUTOPLAY_WEB'
		| 'TWITTER'
		| 'FACEBOOK'
		| 'INSTAGRAM'
		| 'TIKTOK'
		| 'SNAPCHAT'
		| 'HOMEPAGE';
};

export type Error = {
	code: string;
	detail: string;
	meta: ErrorMeta;
	source?: ErrorSource;
};

export type ErrorMeta = {
	category: string;
};

export type ErrorSource = {
	parameter: string;
};

export type ApiError = {
	errors: Error[];
};
