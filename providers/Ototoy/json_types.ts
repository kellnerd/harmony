export interface PackagePage {
	thumbUrl: string;
	albumMeta: AlbumMeta;
	trackList: Track[];
}

export interface AlbumMeta {
	title: string;
	artists: Artist[];
	originalReleaseDate?: string;
	releaseDate?: string;
	label?: Label;
}

export interface Artist {
	name: string;
	url: string;
}

export interface Label {
	name: string;
	url: string;
	catalogNumber?: string;
}

export interface Track {
	title: string;
	artists?: Artist[];
	trackNumber: number;
	discNumber?: number;
	/** Track duration in seconds */
	duration: number;
}
