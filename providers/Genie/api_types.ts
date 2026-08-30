export interface GenieResult {
	/** Response status code, `"0"` indicates success. */
	ret_code: string;
	/** Response status message, e.g. "성공" (success). */
	ret_msg: string;
}

export interface GenieAlbumResponse {
	result: GenieResult;
	album_info?: GenieAlbumInfo;
	album_song_list?: GenieSong[];
	/** Music videos, magazine articles, user comments and album recommendations (unused). */
	album_mv_list?: unknown[];
	album_magazine_list?: unknown[];
	reply_list?: unknown[];
	album_popular_list?: unknown[];
}

export interface GenieAlbumInfo {
	album_id: string;
	album_name: string;
	artist_id: string;
	artist_name: string;
	/** Percent-encoded 140x140 artist image URL. */
	artist_img_path: string;
	/** The album's release date, formatted as YYYYMMDD. */
	album_release_dt: string;
	/** Album description with HTML markup, often contains detailed credits. */
	album_desc: string;
	/** The distributor (유통사), e.g. "카카오엔터테인먼트". Can contain multiple comma-separated values. */
	album_producer: string;
	/** The planning agency/label (기획사), e.g. "WM Entertainment". Can contain multiple comma-separated values. */
	album_planner: string;
	/** Whether the album is age-restricted, "Y" or "N". */
	album_adlt_yn: string;
	/** Percent-encoded 140x140 cover image URL. */
	album_img_path: string;
	/** Percent-encoded 600x600 cover image URL (the largest available size). */
	album_img_path600: string;
	/** The type of the album: "싱글/EP", "정규앨범", "베스트/컬렉션", "컴필레이션" or "기타앨범". */
	album_type: string;
	/** Whether the album is available for service, "Y" or "N". */
	album_service_yn: string;
	/** Subgenre, e.g. "댄스" or "애니메이션/게임". */
	lowcode_name: string;
	/** Main genre category, e.g. "가요", "OST" or "J-POP". */
	middlecode_name: string;
	total_reply_cnt: string;
	like_cnt: string;
	like_yn: string;
	dolby_yn: string;
}

export interface GenieSong {
	song_id: string;
	dlm_song_lid: string;
	song_name: string;
	artist_id: string;
	artist_name: string;
	album_id: string;
	album_name: string;
	/** Percent-encoded 140x140 cover image URL. */
	album_img_path: string;
	/** Percent-encoded 100x100 cover image URL. */
	thumbnail_img_path: string;
	/** Whether the song is age-restricted, "Y" or "N". */
	song_adlt_yn: string;
	mv_adlt_yn: string;
	/** Whether the song is a title (promoted) song, "Y" or "N". */
	rep_yn: string;
	lyrics_yn: string;
	/** Content provider code. */
	cp_code: string;
	/** Whether the song is available for streaming, "Y" or "N". */
	stream_service_yn: string;
	/** Whether the song is available for (FLAC) download, "Y" or "N". */
	down_service_yn: string;
	/** Whether the song is available for MP3 download, "Y" or "N". */
	down_mp3_service_yn: string;
	album_adlt_yn: string;
	/** Disc number as a string, e.g. "1". */
	album_cd_no: string;
	/** Track number as a string, e.g. "1". */
	album_track_no: string;
	/** The album's release date, formatted as YYYYMMDD. */
	album_release_dt: string;
	/** The distributor (유통사) of the album. */
	album_producer: string;
	/** Whether the song is temporarily excluded from streaming, "Y" or "N". */
	hold_back: string;
	/** Duration in seconds as a string. */
	duration: string;
	/** Bitfield of available FLAC qualities as a string. */
	flac_file_bit: string;
	song_tts: string;
	artist_tts: string;
	mv_service_cnt: number;
	dolby_yn: string;
}
