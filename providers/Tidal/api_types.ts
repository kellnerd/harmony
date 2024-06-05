export type Artist = {
	/** The Tidal ID */
	id: string;
	name: string;
	picture: Image[];
	main: boolean;
	tidalUrl: string;
};

export type Album = {
	/** The Tidal ID */
	id: string;
	barcodeId: string;
	title: string;
	artists: Artist[];
	/** Full release duration in seconds */
	duration: number;
	/** Release date in YYYY-MM-DD format */
	releaseDate: string;
	imageCover: Image[];
	videoCover: Image[];
	numberOfVolumes: number;
	numberOfTracks: number;
	numberOfVideos: number;
	type: string;
	copyright: string;
	mediaMetadata: MediaMetadata;
	properties: Properties;
	tidalUrl: string;
};

export type AlbumItem = {
	artifactType: 'track' | 'video';
	/** The Tidal ID */
	id: string;
	title: string;
	artists: Artist[];
	/** Track duration in seconds */
	duration: number;
	trackNumber: number;
	volumeNumber: number;
	isrc: string;
	copyright: string;
	mediaMetadata: MediaMetadata;
	properties: Properties;
	tidalUrl: string;
};

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

export type Error = {
	category: string;
	code: string;
	detail: string;
	field: string;
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
