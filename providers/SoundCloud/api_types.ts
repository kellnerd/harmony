// Classes from https://github.com/Moebytes/soundcloud.ts
// MIT License
export type SoundcloudImageFormats =
	| 't500x500'
	| 'crop'
	| 't300x300'
	| 'large'
	| 't67x67'
	| 'badge'
	| 'small'
	| 'tiny'
	| 'mini';

export type SoundcloudLicense =
	| 'no-rights-reserved'
	| 'all-rights-reserved'
	| 'cc-by'
	| 'cc-by-nc'
	| 'cc-by-nd'
	| 'cc-by-sa'
	| 'cc-by-nc-nd'
	| 'cc-by-nc-sa';

export type SoundcloudTrackType =
	| 'original'
	| 'remix'
	| 'live'
	| 'recording'
	| 'spoken'
	| 'podcast'
	| 'demo'
	| 'in progress'
	| 'stem'
	| 'loop'
	| 'sound effect'
	| 'sample'
	| 'other';

export interface SoundcloudTrack {
	artwork_url: string;
	comment_count: number;
	commentable: boolean;
	created_at: string;
	description: string;
	display_date: string;
	download_count: number;
	downloadable: boolean;
	duration: number;
	embeddable_by: 'all' | 'me' | 'none';
	full_duration: number;
	genre: string;
	has_downloads_left: boolean;
	id: number;
	kind: string;
	label_name: string;
	last_modified: string;
	license: SoundcloudLicense;
	likes_count: number;
	monetization_model: string;
	permalink: string;
	permalink_url: string;
	playback_count: number;
	policy: string;
	public: boolean;
	purchase_title: string;
	purchase_url: string;
	reposts_count: number;
	secret_token: string;
	sharing: 'private' | 'public';
	state: 'processing' | 'failed' | 'finished';
	streamable: boolean;
	tag_list: string;
	title: string;
	uri: string;
	urn: string;
	user: SoundcloudUser;
	user_id: number;
	visuals: string;
	waveform_url: string;
	release: string | null;
	key_signature: string | null;
	isrc: string | null;
	bpm: number | null;
	release_year: number | null;
	release_month: number | null;
	release_day: number | null;
	stream_url: string;
	download_url: string | null;
	available_country_codes: string[] | null;
	secret_uri: string | null;
	user_favorite: boolean | null;
	user_playback_count: number | null;
	favoritings_count: number;
	access: string;
	metadata_artist: string;
}

export interface SoundcloudPlaylist {
	duration: number;
	permalink_url: string;
	reposts_count: number;
	genre: string | null;
	permalink: string;
	purchase_url: string | null;
	description: string | null;
	uri: string;
	urn: string;
	label_name: string | null;
	tag_list: string;
	set_type: string;
	public: boolean;
	track_count: number;
	user_id: number;
	last_modified: string;
	license: SoundcloudLicense;
	tracks: SoundcloudTrack[];
	id: number;
	display_date: string;
	sharing: 'public' | 'private';
	secret_token: string | null;
	created_at: string;
	likes_count: number;
	kind: string;
	title: string;
	purchase_title: string | null;
	managed_by_feeds: boolean;
	artwork_url: string | null;
	is_album: boolean;
	user: SoundcloudUser;
	published_at: string | null;
	embeddable_by: 'all' | 'me' | 'none';
	release_year: number | null;
	release_month: number | null;
	release_day: number | null;
	type: string | null;
	playlist_type: string | null;
}

export interface SoundcloudUser {
	avatar_url: string;
	city: string;
	comments_count: number;
	country_code: number | null;
	created_at: string;
	creator_subscriptions: SoundcloudCreatorSubscription[];
	creator_subscription: SoundcloudCreatorSubscription;
	description: string;
	followers_count: number;
	followings_count: number;
	first_name: string;
	full_name: string;
	groups_count: number;
	id: number;
	kind: string;
	last_modified: string;
	last_name: string;
	likes_count: number;
	playlist_likes_count: number;
	permalink: string;
	permalink_url: string;
	playlist_count: number;
	reposts_count: number | null;
	track_count: number;
	uri: string;
	urn: string;
	username: string;
	verified: boolean;
	visuals: {
		urn: string;
		enabled: boolean;
		visuals: SoundcloudVisual[];
		tracking: null;
	};
}

export interface SoundcloudVisual {
	urn: string;
	entry_time: number;
	visual_url: string;
}

export interface SoundcloudCreatorSubscription {
	product: {
		id: string;
	};
}

//Custom Classes

export type ApiError = {
	code: number;
	message: string;
	link: string;
	status: string;
	errors: string[];
	error: string | null;
};

export type RawReponse = {
	/** Raw Data from the soundcloud API */
	apiResponse: SoundcloudTrack | SoundcloudPlaylist;
	/** The type of release, either 'track' or 'playlist' */
	type: 'track' | 'playlist';
	/** Url of the release */
	href: string;
};
