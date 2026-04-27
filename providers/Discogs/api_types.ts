export interface Release {
	/** Discogs ID of the release. */
	id: number;
	title: string;
	artists: Artist[];
	/** Release date (YYYY-MM-DD). */
	released?: string;
	/** Name of the country (or region) of release. */
	country: string | null;
	/** Release labels with catalog numbers. */
	labels: Label[];
	series: Label[];
	/** Discogs ID of the master release. */
	master_id?: number;
	/** Identifiers (barcode, label code, rights society, matrix etc.) */
	identifiers: Identifier[];
	/** Release format, including medium format, packaging, status etc. */
	formats: ReleaseFormat[];
	tracklist: Track[];
	/** Credited artists and their roles. */
	extraartists?: Artist[];
	/** Credited companies. */
	companies: Label[];
	/** Images of the release, excluding all disabled images. */
	images: Image[];
	/** Top-level genres (and release types). */
	genres: Genre[];
	/** Specific genres / music styles (and release types). */
	styles: string[];
	/** API URL of the release. */
	resource_url: string;
}

export interface Artist {
	/** Discogs ID of the artist. */
	id: number;
	/** Primary artist name (PAN). */
	name: string;
	/** Artist name variation (ANV), can be empty (when no variation is used). */
	anv: string;
	/** Artist credit join phrase, can be empty. */
	join: string;
	/** Role of the artist, can be empty. May contain a role credit in square brackets. */
	role: string;
	/** Track ranges for which the role applies, can be empty. */
	tracks: string;
	/** API URL of the artist. */
	resource_url: string;
	thumbnail_url?: string;
}

export interface Label {
	/** Discogs ID of the label. */
	id: number;
	name: string;
	/** Catalog number, can be "none" (release label) or empty (company credit). */
	catno: string;
	/** Numeric label credit type. */
	entity_type: string;
	/** Name of the label credit type. */
	entity_type_name: string;
	/** API URL of the label. */
	resource_url: string;
	thumbnail_url?: string;
}

export interface Track {
	/** Track position, can be empty. */
	position: string;
	/** Indicates whether the object is a proper track or a structural element. */
	type_: 'track' | 'heading' | 'index';
	title: string;
	artists?: Artist[];
	/** Duration in m:ss format, can be empty. */
	duration: string;
	/** Credited artists and their roles. */
	extraartists?: Artist[];
	/** Index tracks can have multiple sub-tracks. */
	sub_tracks?: Track[];
}

export interface Identifier {
	type: string;
	value: string;
	description?: string;
}

export interface ReleaseFormat {
	/** Name of the format. */
	name: string;
	/** Numeric quantity of the format. */
	qty: string;
	/** Descriptions like size, speed, status etc. */
	descriptions: string[];
	/** Freeform text, may contain packaging. */
	text?: string;
}

export interface Image {
	/** Type of the image. */
	type: 'primary' | 'secondary';
	/** URL of the 600x600 image. */
	uri: string;
	/** Same as `uri`.*/
	resource_url: string;
	/** URL of the 150x150 thumbnail. */
	uri150: string;
	width: number;
	height: number;
}

export type Genre =
	| 'Electronic'
	| 'Hip Hop'
	| 'Jazz'
	| 'Rock'
	| 'Reggae'
	| 'Latin'
	| 'Funk / Soul'
	| 'Blues'
	| 'Non-Music'
	| 'Pop'
	| 'Classical'
	| 'Brass & Military'
	| "Children's"
	| 'Folk, World, & Country'
	| 'Stage & Screen';

export interface SearchResults<T> {
	pagination: Pagination;
	results: T[];
}

export interface Pagination {
	/** Current page number. */
	page: number;
	/** Total number of pages. */
	pages: number;
	/** Total number of results. */
	items: number;
	/** Number of results per page. Default: 50, Maximum: 100. */
	per_page: number;
	/** URLs of other result pages. */
	urls: {
		first?: string;
		prev?: string;
		next?: string;
		last?: string;
	};
}

export interface ReleaseResult {
	type: 'release';
	/** Discogs ID of the result. */
	id: number;
	/** Artist - Title */
	title: string;
	country: string;
	year: string;
	/** Release labels and other companies. */
	label: string[];
	catno: string;
	/** Barcodes and other identifiers. */
	barcode?: string[];
	style: string[];
	genre: string[];
	formats: ReleaseFormat[];
	/** Short form of the release format. */
	format: string[];
	/** Always empty, even when authenticated? */
	cover_image: string;
	/** Always empty, even when authenticated? */
	thumb: string;
	/** API URL of the result. */
	resource_url: string;
	/** Relative link to the result. */
	uri: string;
}

export interface ApiError {
	message: string;
}
