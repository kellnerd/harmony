export interface Release {
	/** Discogs ID of the release. */
	id: number;
	title: string;
	artists: Artist[];
	/** Release date (YYYY-MM-DD). */
	released: string;
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
	catno: string;
	/** Numeric label type. */
	entity_type: string;
	/** Name of the label type. */
	entity_type_name: string;
	/** API URL of the label. */
	resource_url: string;
	thumbnail_url?: string;
}

export interface Track {
	position: string;
	title: string;
	artists?: Artist[];
	/** Duration in m:ss format, can be empty. */
	duration: string;
	/** Credited artists and their roles. */
	extraartists?: Artist[];
}

export interface Identifier {
	type: string;
	value: string;
	description?: string;
}

export interface ReleaseFormat {
	/** Name of the format. CD */
	name: string;
	/** Numeric quantity of the format. */
	qty: string;
	/** Descriptions like size, speed, status etc. */
	descriptions: string[];
	/** Freeform text, may contain packaging. */
	text?: string;
}
