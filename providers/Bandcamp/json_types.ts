export interface AlbumPage {
	tralbum: TrAlbum;
}

interface TrAlbum {
	'for the curious': 'https://bandcamp.com/help/audio_basics#steal https://bandcamp.com/terms_of_use';
	current: TrAlbumCurrent;
	preorder_count: null;
	hasAudio: boolean;
	art_id: number;
	/** Available physical packages of the release, if any. */
	packages: Package[] | null;
	defaultPrice: number;
	/** URL to the download page of a free download release (`null` for paid downloads). */
	freeDownloadPage: string | null;
	FREE: 1;
	PAID: 2;
	/** Name of the artist. */
	artist: string;
	/** Type of the release. */
	item_type: ReleaseType;
	/** ID of the release. */
	id: number;
	last_subscription_item: null;
	has_discounts: boolean;
	is_bonus: null;
	play_cap_data: PlayCapData | null;
	client_id_sig: null;
	is_purchased: null;
	items_purchased: null;
	is_private_stream: null;
	is_band_member: null;
	licensed_version_ids: null;
	package_associated_license_id: null;
	has_video: null;
	tralbum_subscriber_only: boolean;
	featured_track_id: number;
	initial_track_num: null;
	/** Indicates whether the release can be pre-ordered. @todo Does this change upon release? */
	is_preorder: boolean;
	/** Indicates whether the release can be pre-ordered. Same as {@linkcode is_preorder}? */
	album_is_preorder: boolean;
	/** GMT date string when the release is/was released. */
	album_release_date: string;
	/** Tracklist of the download release. */
	trackinfo: TrackInfo[];
	playing_from: 'album page';
	/** URL of the release page. */
	url: string;
	use_expando_lyrics: boolean;
}

interface TrAlbumCurrent {
	audit: number;
	/** Title of the release. */
	title: string;
	/** GMT date string when the release page was created? @todo */
	new_date: string;
	/** GMT date string when the release page was last modified. */
	mod_date: string;
	/** GMT date string when the release page was published. */
	publish_date: string;
	private: null;
	killed: null;
	download_pref: DownloadPreference | null;
	require_email: null;
	is_set_price: null;
	set_price: number;
	minimum_price: number;
	minimum_price_nonzero: number;
	require_email_0: null;
	artist: null;
	/** Description of the release. */
	about: string;
	/** Credits and copyright. */
	credits: string;
	auto_repriced: null;
	new_desc_format: 1;
	/** ID of the band (artist). */
	band_id: number;
	/** ID of the selling band (artist). */
	selling_band_id: number;
	art_id: number;
	download_desc_id: null;
	/** GMT date string when the release is/was released. */
	release_date: string;
	/** UPC/EAN barcode of the download release. */
	upc: string | null;
	purchase_url: null;
	purchase_title: null;
	featured_track_id: number;
	/** ID of the release */
	id: number;
	/** Type of the release. */
	type: ReleaseType;
}

enum DownloadPreference {
	FREE = 1,
	PAID = 2,
}

export interface TrackInfo {
	/** ID of the track. */
	id: number;
	/** ID of the track. Same as {@linkcode id}. */
	track_id: number;
	/** Maps file formats to download URLs (`null` for unreleased tracks). */
	file: FileUrls | null;
	/** @todo Is this not `null` if the track artist is different from the release artist? */
	artist: null;
	/** Title of the track. */
	title: string;
	encodings_id: number;
	license_type: 1; // TODO
	private: null;
	/** Number of the track. */
	track_num: number;
	/** Indicates whether the release can be pre-ordered. @todo Does this change upon release? */
	album_preorder: boolean;
	/** Indicates whether the track is still unreleased. */
	unreleased_track: boolean;
	/** Relative URL to the track page (`null` for unreleased tracks). */
	title_link: string | null;
	/** Indicates whether the track has lyrics available (`null` for unreleased tracks). */
	has_lyrics: boolean | null;
	/** Indicates whether info about the the track is available (`false` for unreleased tracks). */
	has_info: boolean;
	/** Indicates whether the track can be streamed (can also be `1` for unreleased tracks). */
	streaming: 1; // = boolean `1 | null`?
	is_downloadable: boolean | null;
	has_free_download: null;
	free_album_download: boolean;
	/** Duration in seconds (floating point, `0.0` for unreleased tracks). */
	duration: number;
	/** Always `null` on release pages, even if lyrics exist on the track page. */
	lyrics: null;
	/** Size of the lyrics (in bytes). */
	sizeof_lyrics: number;
	is_draft: boolean;
	video_source_type: null;
	video_source_id: null;
	video_mobile_url: null;
	video_poster_url: null;
	video_id: null;
	video_caption: null;
	video_featured: null;
	alt_link: null;
	encoding_error: null;
	encoding_pending: null;
	play_count: null;
	is_capped: null;
	track_license_id: null;
}

interface PlayCapData {
	streaming_limits_enabled: boolean;
	streaming_limit: number;
}

export interface PlayerData {
	band_enabled: 1; // = boolean `1 | null`?
	/** URL of the artist/label page. */
	band_url: string;
	/** Title of the release. */
	album_title: string;
	album_art_id: number;
	/** Name of the artist. */
	artist: string;
	/** Bandcamp subdomain (artist/label ID). */
	subdomain: string;
	/** ID of the release. */
	album_id: number;
	killed: null;
	/** GMT date string when the release page was published. */
	publish_date: string;
	album_private: null;
	featured_track_id: number;
	/** URL of the release page. */
	linkback: string;
	linkback_action: 'buy' | 'download'; // TODO
	subscriber_only: boolean;
	/** Tracklist of the download release. Includes all durations! */
	tracks: PlayerTrack[];
	google_analytics_id: null;
	exclusive_permitted_domains: string[];
	exclusive_show_anywhere: 0 | null;
	no_exclusive_data: 1 | null;
	is_preorder: 1 | null;
	/** Maps track IDs to stream info. */
	stream_infos: Record<string, StreamInfo>;
	/** URL of the download release cover (small). */
	album_art: string;
	/** URL of the download release cover (large). */
	album_art_lg: string;
	/** Available packages. Includes `quantity_sold` count! */
	packages: Package[];
}

export interface PlayerTrack {
	/** Name of the track(?) artist. */
	artist: string;
	/** Title of the track. */
	title: string;
	/** ID of the track. */
	id: number;
	encodings_id: number;
	/** @todo Is this used for track art? */
	art_id: null;
	/** Duration in seconds (floating point, also set for unreleased tracks). */
	duration: number;
	/** Number of the track (zero-based index). */
	tracknum: number;
	/** URL of the track page (also set for unreleased tracks, but 404s). */
	title_link: string;
	/** Maps file formats to download URLs (`null` for unreleased tracks). */
	file: FileUrls | null;
	/** Indicates whether the track can be streamed (can also be true` for unreleased tracks). */
	track_streaming: boolean;
	/** Indicates whether the track is included in the pre-order. */
	preorder_download_track: boolean;
}

type FileUrls = Record<'mp3-128', string>;

const releaseTypes = ['album', 'track'] as const;

type ReleaseType = typeof releaseTypes[number];

/** Package a physical edition of the release is sold in. */
interface Package {
	/** ID of the package. */
	id: number;
	url: string;
	url_for_app: string;
	/** ID of the package type. */
	type_id: number;
	/** Name of the package type (format). */
	type_name: PackageType;
	/** Title of the package. */
	title: string;
	/** Full description of the package. */
	description: string;
	/** First part of the {@linkcode description}. */
	desc_pt1: string;
	/** Remainder of the {@linkcode description}. */
	desc_pt2: string | null;
	new_desc_format: 1;
	grid_index: 0;
	private: null;
	subscriber_only: null;
	/** Price of the package (floating point, in the given {@linkcode currency}). */
	price: number;
	is_set_price: null;
	is_live_ticket: null;
	live_event_over: null;
	live_event_id: null;
	live_event_title: null;
	live_event_url: null;
	live_event_gcal_url: null;
	live_event_ical_url: null;
	live_event_replays_enabled: null;
	live_event_image_color_one: null;
	live_event_image_color_two: null;
	sku: '';
	/** UPC/EAN barcode of the package. */
	upc: string | null;
	/** ID of the band (artist). */
	band_id: number;
	/** ID of the selling band (artist). */
	selling_band_id: number;
	label: null;
	/** Currency of the {@linkcode price} as a three letter code, e.g. `EUR`. */
	currency: string;
	country: null;
	tax_rate: null;
	options_title: null;
	options: null;
	origins: PackageOrigin[];
	arts: ArtworkItem[];
	album_art: null;
	album_art_id: number;
	shipping_exception_mode: null;
	download_type: 'a'; // TODO
	/** ID of the release. */
	download_id: number;
	download_is_preorder: 1 | null;
	/** GMT date string when the download is/was released. */
	download_release_date: string;
	/** Title of the release. */
	download_title: string;
	/** URL of the release page. */
	download_url: string;
	download_has_audio: true;
	/** Number of tracks which can currently be downloaded. */
	download_track_count: number;
	download_art_id: number;
	/** Name of the artist. */
	download_artist: string;
	/** Number of days within which the package will be shipped. */
	fulfillment_days: number;
	release_date: null;
	/** GMT date string when the package was created on Bandcamp? @todo */
	new_date: string;
	/** Number of copies which were produced of this package. */
	edition_size: number;
	/** Number of copies which were already sold. */
	quantity_sold: number | null;
	/** Number of copies which are still available. */
	quantity_available: number;
	quantity_limits: number;
	/** Bandcamp shows a warning when only few copies are remaining. */
	quantity_warning: boolean;
	/** ID of the release. */
	album_id: number;
	/** Title of the release. */
	album_title: string;
	/** Name of the artist. Can be `null` if it is the same as the Bandcamp account? */
	album_artist: string | null;
	album_private: null;
	/** GMT date string when the release page was published. */
	album_publish_date: string;
	/** GMT date string when the release is/was released. */
	album_release_date: string;
	subscriber_only_published: boolean;
	featured_date: null;
	certified_seller: 1;
	limited_checkout: boolean;
	associated_license_id: null;
	live_event_scheduled_start_date: null;
	live_event_scheduled_end_date: null;
	live_event_start_date: null;
	live_event_end_date: null;
	live_event_timezone: null;
	live_event_type: null;
	listening_party_duration: null;
	is_cardable: boolean;
}

interface ArtworkItem {
	id: number;
	/** File name of the image (basename without path and extension). */
	file_name: string;
	index: number;
	image_id: number;
	/** Width of the image. */
	width: number;
	/** Height of the image. */
	height: number;
	crc: number;
}

interface PackageOrigin {
	id: number;
	/** Number of copies which were initially available from this origin. */
	quantity: number | null;
	/** Number of copies which were already sold. */
	quantity_sold: number | null;
	/** Number of copies which are still available. */
	quantity_available: number;
	/** ID of the package. */
	package_id: number;
	option_id: 0;
}

interface StreamInfo {
	encodings_id: number;
	stream_type: 't'; // TODO
	format: number;
	file_id: number;
	metadata_crc: null;
}

const packageTypes = {
	0: 'Other',
	1: 'Compact Disc (CD)',
	2: 'Vinyl LP',
	3: 'Cassette',
	15: '2 x Vinyl LP',
	16: '7" Vinyl',
} as const;

type PackageType = typeof packageTypes[keyof typeof packageTypes];
