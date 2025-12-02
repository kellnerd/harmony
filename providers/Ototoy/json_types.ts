export interface PackagePage {
	thumbUrl: string;
	albumMeta: AlbumMeta;
	trackList: Track[];
}

export interface AlbumMeta {
	title: string;
	artists: Artist[];
	releaseDate: string;
	label?: Label;
}

export interface Artist {
	name: string;
	id: string;
}

export interface Label {
	name: string;
	id: string;
	catalogNumber?: string;
}

export interface Track {
	title: string;
	trackNumber: number;
	discNumber?: number;
	/** Track duration in seconds */
	duration: number;
}
