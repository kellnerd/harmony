export type SimpleArtist = {
	/** The Tidal ID */
	id: string;
	name: string;
	picture: Image[];
	main: boolean;
};

export type Artist = SimpleArtist & {
	tidalUrl: string;
	popularity: number;
};

export type SimpleAlbum = {
	/** The Tidal ID */
	id: string;
	title: string;
	imageCover: Image[];
	videoCover: Image[];
};

export type Album = SimpleAlbum & {
	barcodeId: string;
	artists: SimpleArtist[];
	/** Full release duration in seconds */
	duration: number;
	/** Release date in YYYY-MM-DD format */
	releaseDate: string;
	numberOfVolumes: number;
	numberOfTracks: number;
	numberOfVideos: number;
	type: 'ALBUM' | 'EP' | 'SINGLE';
	copyright?: string;
	mediaMetadata: MediaMetadata;
	properties: Properties;
	tidalUrl: string;
	providerInfo: ProviderInfo;
	popularity: number;
};

export type CommonAlbumItem = {
	artifactType: 'track' | 'video';
	/** The Tidal ID */
	id: string;
	title: string;
	artists: SimpleArtist[];
	/** Track duration in seconds */
	duration: number;
	/** Version of the album's item; complements title */
	version: string;
	album: SimpleAlbum;
	trackNumber: number;
	volumeNumber: number;
	isrc: string;
	copyright?: string;
	mediaMetadata: MediaMetadata;
	tidalUrl: string;
	providerInfo: ProviderInfo;
	popularity: number;
};

export type Track = CommonAlbumItem & {
	properties: Properties;
};

export type Video = CommonAlbumItem & {
	properties: VideoProperties;
	image: Image;
	releaseDate: string;
};

export type AlbumItem = Track | Video;

export type Image = {
	url: string;
	width: number;
	height: number;
};

export type Resource<T> = {
	id: string;
	status: number;
	message: string;
	resource: T;
};

export type MediaMetadata = {
	tags: string[];
};

export type Properties = {
	/** Can be "explicit", other? */
	content: string;
};

export type VideoProperties = Properties & {
	/** Example: live-stream */
	'video-type': string;
};

export type ProviderInfo = {
	providerId: string;
	providerName: string;
};

export type Error = {
	category: string;
	code: string;
	detail: string;
	field?: string;
};

export type ApiError = {
	errors: Error[];
};

export type ResultMetadata = {
	total: number;
	requested: number;
	success: number;
	failure: number;
};

export type Result<T> = {
	data: Resource<T>[];
	metadata: ResultMetadata;
};
