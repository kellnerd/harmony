// Sourced from https://github.com/Lioncat6/SAMBL-React/blob/db2affebfff0b2614c0c839a3c6ef3043688b4b4/lib/providers/naver.ts
// License TBD

// Response Wrapper
export interface NaverResponse<TResult> {
	response: {
		result: TResult;
	};
}

// Shared Artist Types
export interface NaverPartialArtist {
	artistId: number;
	artistName: string;
	imageUrl?: string;
}

export interface NaverArtist extends NaverPartialArtist {
	debutDate?: string;
	genreNames: string;
	likeCount: number;
	isGroup: boolean;
}

export interface NaverArtistResult {
	artist: NaverArtist;
}

// Artist Search
export interface NaverSearchResult {
	originalQuery: string;
}

export interface NaverArtistSearchResult extends NaverSearchResult {
	artistTotalCount: number;
	artists?: NaverArtist[];
}

// Artist Detail (artistEnd)
export interface NaverArtistPhoto {
	musicianPhotoType: string;
	thumbnailImageUrl: string;
	bodyImageUrl: string;
	originalImageUrl: string;
	imageUrlKey: string;
	photoViewerImgId: string;
	photoViewerIndex: number;
}

export interface NaverArtistMember {
	artistId: number;
	artistName: string;
	imageUrl?: string;
	likeCount: number;
}

export interface NaverArtistEnd {
	artistId: number;
	artistName: string;
	debutDate: string;
	gender: string;
	isGroup: boolean;
	activePeriod: string;
	managementName: string;
	genreNames: string;
	memberGroupArtistIds: string;
	memberGroupArtistNames: string;
	imageUrl: string;
	biography?: string;
	likeCount: number;
	photoCount: number;
	photoList: NaverArtistPhoto[];
	memberList: NaverArtistMember[];
}

// Album Types
export interface NaverAlbumBase {
	albumId: number;
	albumTitle: string;
	releaseDate: string;
	imageUrl: string;
	isDolbyAtmos: boolean;
	hasDolbyAtmos: boolean;
	isVariousArtists: boolean;
}

export interface NaverPartialAlbum extends NaverAlbumBase {
	artists: NaverPartialArtist[];
}

export interface NaverAlbum extends NaverAlbumBase {
	isRegular: boolean;
	isAdult: boolean;
	agencyName: string;
	productionName: string;
	artists: NaverPartialArtist[];
	serviceStatusMsg: string;
	sizeAndDuration: string;
	trackTotalCount: number;
	artistTotalCount: number;
	albumGenres: string;
	albumGenreList: string[];
	shareUrl: string;
	likeCount: number;
	playtime: number;
}

export interface NaverAlbumResult {
	album: NaverAlbum;
}

// Track Credits (writers, composers, arrangers)
export interface NaverCreditArtist {
	artistId: number;
	artistName: string;
	isDisplay: boolean;
}

export type NaverLyricWriter = NaverCreditArtist;
export type NaverComposer = NaverCreditArtist;
export type NaverArranger = NaverCreditArtist;

// Track Information (/track/{id}/info.json)
export interface NaverTrackInformation {
	trackId: number;
	lyricWriters: NaverLyricWriter[];
	composers: NaverComposer[];
	arrangers: NaverArranger[];
	hasLyric: string;
	hasSyncLyric: string;
	syncLyric: string;
	lyricSourceTypeCd: string;
	lyricRegisterUserId: number | null;
	lyricUpdateUserId: number | null;
}

// Track Credits (/track/{id}/credits.json)
export interface NaverTrackCreditsResult {
	trackCredits: NaverTrackCredits;
}

export interface NaverTrackCredits {
	trackId: number;
	trackName: string;
	artistIds: string;
	artistNames: string;
	releaseDate: string;
	participantGroupList: NaverParticipantGroup[];
}

export interface NaverParticipantGroup {
	roleName: string;
	participantList: NaverParticipant[];
}

export interface NaverParticipant {
	id: number;
	name: string;
	likeCount: number;
	imageUrl: string | null;
}

// Track Detail (/track/{id}.json)
export interface NaverTrack {
	trackId: number;
	trackTitle: string;
	represent: boolean;
	discNumber: number;
	trackNumber: number;
	artists: NaverPartialArtist[];
	album: NaverPartialAlbum;
	hasLyric: boolean;
	hasSyncLyric: boolean;
	isStreaming: boolean;
	isDownload: boolean;
	isMobileDownload: boolean;
	isAdult: boolean;
	representDownloadPrice: number;
	isPrdd: boolean;
	isAodd: boolean;
	isOversea: boolean;
	playTime: string;
	isKaraokeEnabled: boolean;
	isDolbyAtmos: boolean;
	hasDolbyAtmos: boolean;
}

export interface NaverTrackResult {
	track: NaverTrack;
}

// Search-All (/searchall.json)
export interface NaverSearchAllTrackResult {
	trackTotalCount: number;
	tracks: NaverTrack[];
}

export interface NaverSearchAllAlbumResult {
	albumTotalCount: number;
	albums: NaverPartialAlbum[];
}

export interface NaverSearchAllArtistResult {
	artistTotalCount: number;
	artists: NaverArtist[];
}

export interface NaverSearchAllResult extends NaverSearchResult {
	lyricResult: { trackTotalCount: number };
	trackResult: NaverSearchAllTrackResult;
	albumResult: NaverSearchAllAlbumResult;
	artistResult: NaverSearchAllArtistResult;
	videoResult: { videoTotalCount: number };
	playlistResult: { playlistTotalCount: number };
	userPlaylistResult: { playlistTotalCount: number };
	newAudioResult: { audioTotalCount: number };
	popularResult: { searchType: number };
}

// Artist Albums
export interface NaverArtistAlbumsResult {
	albumTotalCount: number;
	albums: NaverPartialAlbum[];
}

// Artist Tracks
export interface NaverArtistTracksResult {
	trackTotalCount: number;
	tracks: NaverTrack[];
}

// Album Tracks
export interface NaverAlbumTrack extends NaverTrack {
	likeCount?: number;
	score?: number;
	isTopPopular?: boolean;
}

export interface NaverAlbumTracksResult {
	trackTotalCount: number;
	tracks: NaverAlbumTrack[];
}

// Custom Types
export interface NaverAlbumWithTracks extends NaverAlbum {
	tracks?: NaverAlbumTrack[];
}

export interface NaverPartialAlbumWithTracks extends NaverPartialAlbum {
	tracks?: NaverAlbumTrack[];
	trackTotalCount?: number;
}

// Harmony Types

export interface ApiError {
	response: {
		message: {
			apiStatusCode: string; // Seems to be either `NO_SUCH_RESOURCE` or `PROCESS_FAIL`
			text: string;
		};
	};
}
