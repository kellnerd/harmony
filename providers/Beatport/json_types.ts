export interface BeatportNextData {
	props: {
		pageProps: {
			dehydratedState: {
				queries: Array<ScalarQueryResult<Release> | ArrayQueryResult<Track>>;
			};
			release: Release;
		};
	};
}

export interface QueryResult {
	queryHash: string;
	queryKey: Array<string | Record<string, number>>;
}

export interface ScalarQueryResult<T> extends QueryResult {
	state: {
		data: T;
		status: string;
	};
}

export interface ArrayQueryResult<T> extends QueryResult {
	state: {
		data: {
			next: string | null;
			previous: string | null;
			count: number;
			page: string;
			per_page: number;
			results: Array<T>;
		};
		status: string;
	};
}

export interface Entity {
	id: number;
	name: string;
}

export interface EntityWithUrl extends Entity {
	url: string;
}

export interface Artist extends EntityWithUrl {
	image: Image;
	slug: string;
}

export interface Image {
	id: number;
	uri: string;
	dynamic_uri: string;
}

export interface Label extends Entity {
	image: Image;
	slug: string;
}

export interface BpmRange {
	min: number;
	max: number;
}

export interface Price {
	code: string;
	symbol: string;
	value: number;
	display: string;
}

export interface MinimalRelease extends Entity {
	image: Image;
	label: Label;
	slug: string;
}

export interface Release extends MinimalRelease {
	artists: Artist[];
	bpm_range: BpmRange;
	catalog_number: string;
	desc: string | null;
	enabled: boolean;
	encoded_date: string;
	exclusive: boolean;
	grid: null;
	is_available_for_streaming: boolean;
	is_hype: boolean;
	new_release_date: string;
	override_price: boolean;
	pre_order: boolean;
	pre_order_date: string | null;
	price: Price;
	price_override_firm: boolean;
	publish_date: string;
	remixers: Artist[];
	tracks: string[];
	track_count: number;
	type: Entity;
	upc: string;
	updated: string;
}

export interface Genre extends EntityWithUrl {
	slug: string;
}

export interface Key extends EntityWithUrl {
	camelot_number: number;
	camelot_letter: string;
	chord_type: EntityWithUrl;
	is_sharp: boolean;
	is_flat: boolean;
	letter: string;
}

export interface Track extends EntityWithUrl {
	artists: Artist[];
	publish_status: string;
	available_worldwide: boolean;
	bpm: number;
	catalog_number: string;
	current_status: EntityWithUrl;
	encoded_date: string;
	exclusive: boolean;
	// @todo find tracks where this is not empty
	free_downloads: [];
	free_download_start_date: null;
	free_download_end_date: null;
	genre: Genre;
	is_available_for_streaming: boolean;
	is_hype: boolean;
	isrc: string;
	key: Key;
	label_track_identifier: string;
	length: string;
	length_ms: number;
	mix_name: string;
	new_release_date: string;
	pre_order: boolean;
	price: Price;
	publish_date: string;
	release: MinimalRelease;
	remixers: Artist[];
	sale_type: EntityWithUrl;
	sample_url: string;
	sample_start_ms: number;
	sample_end_ms: number;
	slug: string;
	// @todo find examples where this is set
	sub_genre: null;
}

export interface BeatportRelease extends Release {
	track_objects: Track[];
}
