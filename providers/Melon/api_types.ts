export interface MelonAlbumInfoResponse {
	response?: {
		ALBUMINFO: MelonAlbumInfo;
		/** The type of the album, e.g. "정규", "EP", "싱글" */
		ALBUMTYPE?: string;
		/** The agency/label name (기획사) */
		PLANCNPY?: string;
		/** The distributor/publisher (발매사) */
		SELLCNPY?: string;
	};
	/** Error notification for deleted or nonexistent albums. */
	notification?: {
		message: string;
	};
}

export interface MelonAlbumInfo {
	ALBUMID: string;
	ALBUMNAME: string;
	/** The album's release date, formatted as YYYY.MM.DD */
	ISSUEDATE: string;
	/** 500px thumbnail CDN URL with query string */
	ALBUMIMG: string;
	/** 1000px CDN URL with query string */
	ALBUMIMGLARGE: string;
	ISSERVICE: boolean;
	ARTISTLIST: MelonArtist[];
}

export interface MelonArtist {
	ARTISTID: string;
	ARTISTNAME: string;
}

export interface MelonSongListResponse {
	response?: {
		CDLIST?: MelonDisc[];
	};
	/** Error notification for deleted or nonexistent albums. */
	notification?: {
		message: string;
	};
}

export interface MelonDisc {
	/** Disc number as a string, e.g. "1" */
	CDNO: string;
	SONGLIST: MelonSong[];
}

export interface MelonSong {
	SONGID: string;
	SONGNAME: string;
	ARTISTLIST: MelonArtist[];
	/** Duration in seconds as a string */
	PLAYTIME: string;
	/** Track number as a string */
	TRACKNO: string;
	ISSERVICE: boolean;
	/** Whether the song is marked as a title song, which is usually actively promoted, has an MV, and/or was previously released as a single. */
	ISTITLESONG: boolean;
	ISHOLDBACK: boolean;
}
