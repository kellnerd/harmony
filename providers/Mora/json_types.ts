export interface ApiArgs {
	mountPoint: string;
	labelId: string;
	materialNo: string;
}

export interface WithApiUrl<Data> {
	apiUrl: URL;
	data: Data;
}

export interface PackageMeta {
	artistName: string;
	cdPartNo: string | null;
	fullsizeimage: string;
	title: string;
	labelCode: string;
	labelcompanyname: string;
	master: string;
	distPartNo: string;
	startDate: string;
	mediaFormatNo: MediaFormat;
	mediaType: MediaType;
	trackList: Record<number, Track>;
}

export interface Track {
	arranger?: string;
	composer?: string;
	/** Lyricist name */
	lyrics?: string;

	artistName: string;
	/** Track duration in seconds */
	duration: number;
	mediaFormatNo: MediaFormat;
	mediaType: MediaType;
	title: string;
}

export enum MediaFormat {
	Music = 10,
	Video = 11,
	HiRes = 12,
	Lossless = 15,
}

export enum MediaType {
	AAC = 6,
	AVC_H264 = 7,
	FLAC = 8,
	DSD_DSF = 9,
	DSD_DFF = 10,
}
