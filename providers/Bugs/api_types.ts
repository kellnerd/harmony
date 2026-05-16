export interface BugsMultiResponse {
	list: BugsSection[];
}

export type BugsSection =
	| { album: { result: BugsAlbum } }
	| { album_track: { list: BugsTrack[] } };

export interface BugsArtist {
	artist_id: number;
	artist_nm: string;
	upd_dt?: number;
	image?: { path: string; color?: string; ratio?: number };
	type?: {
		group_yn: boolean;
		group_cd_nm?: string;
		sex_cd_nm?: string;
		category?: string;
	};
	expose_yn?: boolean;
	genres?: Array<{ svc_type: number; svc_nm: string }>;
	valid_yn?: boolean;
}

export interface BugsAlbum {
	album_id: number;
	title: string;
	artists: BugsArtist[];
	image: { path: string; color?: string; ratio?: number };
	/** The album's release date, formatted as YYYYMMDD */
	release_ymd: string;
	rights: {
		streaming: { service_yn: boolean };
		download: { service_yn: boolean };
	};
	/** The type of the album, e.g. "정규", "EP(미니)", "싱글" */
	album_tp_nm?: string;
	agency_nm?: string;
	nation_cd?: string;
	/** The album's description */
	descr?: string;
	labels?: Array<{ label_id: number; label_nm: string }>;
	track_count?: number;
	total_track_len?: string;
}

export interface BugsTrack {
	track_no: number;
	track_id: number;
	track_title: string;
	artists: BugsArtist[];
	disc_id: number;
	rights: {
		streaming: { service_yn: boolean };
		download: { service_yn: boolean };
	};
	/** The track's length, formatted as `MM:SS` or `H:MM:SS` */
	len?: string;
	adult_yn?: boolean;
	title_yn?: boolean;
	valid_yn?: boolean;
}
