export interface Release {
	/** Discogs ID of the release. */
	id: number;
	title: string;
	artists: Artist[];
	/** Release date (YYYY-MM-DD). */
	released: string;
	/** Release labels with catalog numbers. */
	labels: Label[];
	series: Label[];
	/** Identifiers (barcode, label code, rights society, matrix etc.) */
	identifiers: Identifier[];
	tracklist: Track[];
	/** Credited artists and their roles. */
	extraartists: Artist[];
	/** Credited companies. */
	companies: Label[];
	/** API URL of the release. */
	resource_url: string;
}

/**
 * Artist object as returned by the API:
 * - `anv` is empty if no name variation is used.
 * - `role` may contain a role credit in square brackets.
 */
export interface Artist {
	/** Discogs ID of the artist. */
	id: number;
	/** Primary artist name (PAN). */
	name: string;
	/** Artist name variation (ANV). */
	anv: string;
	join: string;
	/** Role of the artist. */
	role: string;
	tracks: string;
	/** API URL of the artist. */
	resource_url: string;
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
	artists: Artist[];
	duration: string;
	/** Credited artists and their roles. */
	extraartists: Artist[];
}

export interface Identifier {
	type: string;
	value: string;
	description?: string;
}
