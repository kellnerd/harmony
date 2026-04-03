// Borrowed from https://github.com/Lioncat6/SAMBL-React/blob/2e35c1e9b45831db1cc935d1e646ec5e9f9adb63/lib/providers/qobuz.ts
// License TBD

export interface QobuzSearchResponse {
	query: string;
	albums?: QobuzPagingResult<QobuzPartialAlbum>;
	tracks?: QobuzPagingResult<QobuzPartialTrack>;
	artists?: QobuzPagingResult<QobuzPartialArtist>;
	playlists?: QobuzPagingResult<QobuzPlaylist>;
	stories?: QobuzPagingResult<unknown>;
}

export interface QobuzPagingResult<T> {
	limit: number;
	offset: number;
	total: number;
	items: T[];
}

export interface QobuzPartialAlbum {
	maximum_bit_depth: number;
	image: QobuzImage;
	media_count: number;
	artist: QobuzPartialArtist;
	artists: QobuzArtistRole[];
	upc: string;
	released_at: number;
	label: QobuzLabel;
	title: string;
	qobuz_id: number;
	version: unknown;
	url: string;
	slug: string;
	duration: number;
	parental_warning: boolean;
	popularity: number;
	tracks_count: number;
	genre: QobuzGenre;
	maximum_channel_count: number;
	id: string;
	maximum_sampling_rate: number;
	articles: unknown[];
	release_date_original: string;
	release_date_download: string;
	release_date_stream: string;
	purchasable: boolean;
	streamable: boolean;
	previewable: boolean;
	sampleable: boolean;
	downloadable: boolean;
	displayable: boolean;
	purchasable_at: number;
	streamable_at: number;
	hires: boolean;
	hires_streamable: boolean;
}

export interface QobuzAlbum extends QobuzPartialAlbum {
	awards: unknown[];
	goodies: unknown[];
	area: unknown;
	catchline: string;
	composer: QobuzComposer;
	created_at: number;
	genres_list: string[];
	period: unknown;
	copyright: string;
	is_official: boolean;
	maximum_technical_specifications: string;
	product_sales_factors_monthly: number;
	product_sales_factors_weekly: number;
	product_sales_factors_yearly: number;
	product_type: string;
	product_url: string;
	recording_information: string;
	relative_url: string;
	release_tags: unknown[];
	release_type: string;
	subtitle: string;
	track_ids: number[];
	tracks?: QobuzPagingResult<QobuzPartialTrack>;
	albums_same_artist: QobuzAlbumsSameArtist;
	description: string;
	description_language?: string;
}

export interface QobuzPartialTrack {
	maximum_bit_depth: number;
	copyright: string;
	performers: string;
	audio_info: AudioInfo;
	performer: QobuzPerformer;
	album?: QobuzPartialAlbum;
	work: unknown;
	isrc: string;
	title: string;
	version: unknown;
	duration: number;
	parental_warning: boolean;
	track_number: number;
	maximum_channel_count: number;
	id: number;
	media_number: number;
	maximum_sampling_rate: number;
	release_date_original: string;
	release_date_download: string;
	release_date_stream: string;
	release_date_purchase: string;
	purchasable: boolean;
	streamable: boolean;
	previewable: boolean;
	sampleable: boolean;
	downloadable: boolean;
	displayable: boolean;
	purchasable_at: number;
	streamable_at: number;
	hires: boolean;
	hires_streamable: boolean;
	maximum_technical_specifications?: string;
	composer?: QobuzPartialComposer;
}

export interface QobuzTrack extends QobuzPartialTrack {
	album: QobuzAlbum;
	created_at: number;
	indexed_at: number;
	articles: unknown[];
	has_lyrics: boolean;
}

export interface QobuzPartialArtist {
	picture: null; // Literally always null, like *always*
	image: QobuzImage | null;
	name: string;
	slug: string;
	albums_count: number;
	id: number;
}

export interface QobuzArtist extends QobuzPartialArtist {
	albums_as_primary_artist_count: number;
	albums_as_primary_composer_count: number;
	similar_artist_ids: number[];
	biography?: QobuzBiography;
	information: unknown;
	tracks?: QobuzPagingResult<QobuzPartialTrack>;
	tracks_appears_on?: QobuzPagingResult<QobuzPartialTrack>;
	albums?: QobuzPagingResult<QobuzPartialAlbum>;
	albums_without_last_release?: QobuzPagingResult<QobuzPartialAlbum>;
}

export interface QobuzBiography {
	summary: string;
	content: string;
	source?: string;
	language?: string;
}

export interface QobuzArtistRole {
	id: number;
	name: string;
	roles: string[];
}

export interface QobuzPlaylist {
	id: number;
	name: string;
	description: string;
	tracks_count: number;
	users_count: number;
	duration: number;
	public_at: number;
	created_at: number;
	updated_at: number;
	is_public: boolean;
	is_collaborative: boolean;
	owner: QobuzOwner;
	indexed_at: number;
	slug: string;
	genres: unknown[];
	images: string[];
	is_published: boolean;
	is_featured: boolean;
	published_from: unknown;
	published_to: unknown;
	images150: string[];
	images300: string[];
}

export interface QobuzImage {
	small: string;
	thumbnail: string;
	large: string;
	extralarge?: string;
	mega?: string;
	back?: string | null;
}

export interface QobuzLabel {
	name: string;
	id: number;
	albums_count: number;
	supplier_id: number;
	slug: string;
}

export interface QobuzGenre {
	path: number[];
	color?: string;
	name: string;
	id: number;
	slug: string;
}

export interface AudioInfo {
	replaygain_track_peak: number;
	replaygain_track_gain: number;
}

export interface QobuzPerformer {
	name: string;
	id: number;
}

export interface QobuzPartialComposer {
	name: string;
	id: number;
}

export interface QobuzComposer extends QobuzPartialComposer {
	slug: string;
	albums_count: number;
	picture: unknown;
	image: unknown;
}

export interface QobuzOwner {
	id: number;
	name: string;
}

export interface QobuzAlbumsSameArtist {
	items: unknown[];
}

//Extended Types
export interface QobuzExtendedArtist extends QobuzPartialArtist, Partial<Omit<QobuzArtist, keyof QobuzPartialArtist>> {}
export interface QobuzExtendedArtistRole
	extends QobuzArtistRole, Partial<Omit<QobuzExtendedArtist, keyof QobuzArtistRole>> {}
export interface QobuzExtendedAlbum extends QobuzPartialAlbum, Partial<Omit<QobuzAlbum, keyof QobuzPartialAlbum>> {}
export interface QobuzExtendedTrack extends QobuzPartialTrack, Partial<Omit<QobuzTrack, keyof QobuzPartialTrack>> {}

export type ApiError = {
	code: number;
	status: string;
	message: string;
};
