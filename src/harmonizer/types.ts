import { immutableReleaseProperties, immutableTrackProperties } from './properties.ts';

import type { Packaging, ReleaseStatus } from '../MusicBrainz/typeId.ts';
import type { PartialDate } from '../utils/date.ts';
import type { ScriptFrequency } from '../utils/script.ts';

export type HarmonyRelease = {
	title: string;
	artists: ArtistCredit;
	gtin?: GTIN;
	externalLinks: ExternalLink[];
	media: HarmonyMedium[];
	language?: Language;
	script?: ScriptFrequency;
	status?: ReleaseStatus;
	releaseDate?: PartialDate;
	labels?: Label[];
	packaging?: Packaging;
	images?: Artwork[];
	copyright?: string;
	availableIn?: CountryCode[];
	excludedFrom?: CountryCode[];
	info: ReleaseInfo;
};

export type HarmonyMedium = {
	title?: string;
	number?: number;
	format?: MediumFormat;
	tracklist: HarmonyTrack[];
};

export type HarmonyTrack = {
	title: string;
	artists?: ArtistCredit;
	number: number | string;
	/** Track duration in milliseconds. */
	duration: number;
	isrc?: string;
	availableIn?: CountryCode[];
};

export type ArtistCreditName = {
	name: string;
	creditedName?: string;
	externalLink?: URL;
	joinPhrase?: string;
};

type ArtistCredit = ArtistCreditName[];

export type Label = {
	name: string;
	externalLink?: URL;
	catalogNumber?: string;
};

export type Artwork = {
	url: URL;
	thumbUrl?: URL;
	types?: ArtworkType[];
	comment?: string;
};

export type ArtworkType = 'front' | 'back';

export type ExternalLink = {
	url: URL;
	types?: LinkType[];
};

export type LinkType =
	| 'discography page'
	| 'free download'
	| 'free streaming'
	| 'mail order'
	| 'paid download'
	| 'paid streaming';

/** MusicBrainz medium formats (incomplete). */
export type MediumFormat =
	| 'Cassette'
	| 'CD'
	| 'CD-R'
	| 'Data CD'
	| 'Digital Media'
	| 'DVD'
	| 'DVD-Audio'
	| 'DVD-Video'
	| 'Vinyl'
	| '7" Vinyl'
	| '12" Vinyl';

/** Global Trade Item Number with 8 (EAN-8), 12 (UPC), 13 (EAN-13) or 14 digits. */
export type GTIN = number | string;

export type Language = {
	/** ISO 639-3 three letter code. */
	code: string;
	confidence?: number;
};

/** ISO 3166-1 alpha-2 two letter country code. */
export type CountryCode = string;

export type ReleaseOptions = Partial<{
	withSeparateMedia: boolean;
	withAllTrackArtists: boolean;
	withISRC: boolean;
	withAvailability: boolean;
	regions?: CountryCode[];
}>;

export type RawReleaseOptions = ReleaseOptions & {
	/** Details about the currently used lookup method, filled automatically. */
	lookup: ReleaseLookupInfo;
};

export type ReleaseLookupInfo = {
	method: 'gtin' | 'id';
	value: string;
	region?: CountryCode;
};

export type ProviderName = string;

/** Mapping from the provider's name to the release returned by that provider. */
export type ProviderReleaseMapping = Record<ProviderName, HarmonyRelease | Error>;

export type ImmutableTrackProperty = typeof immutableTrackProperties[number];

export type ImmutableReleaseProperty = typeof immutableReleaseProperties[number];

export type PreferenceProperty = ImmutableReleaseProperty | ImmutableTrackProperty;

/** Mapping from release/track properties to lists of preferred providers for these properties. */
export type ProviderPreferences = Partial<Record<PreferenceProperty, ProviderName[]>>;

export type ProviderInfo = {
	name: ProviderName;
	id: string;
	region?: CountryCode;
	url: URL;
	apiUrl?: URL;
	/** Processing time of the provider in milliseconds, filled automatically. */
	processingTime?: number;
};

export type MessageType = 'debug' | 'info' | 'warning' | 'error';

export type ProviderMessage = {
	provider?: ProviderName;
	text: string;
	/** Providers should throw errors instead of creating messages of type 'error'. */
	type: MessageType;
};

export type ReleaseInfo = {
	/** Information about each provider which was used to lookup the release. */
	providers: ProviderInfo[];
	/** Messages from the providers which were used to lookup the release. */
	messages: ProviderMessage[];
	/** Mapping from release/track properties to the used provider for these properties. */
	sourceMap?: Partial<Record<PreferenceProperty, ProviderName>>;
};

export type RawResult<T> = {
	data: T;
	lookupInfo: ReleaseLookupInfo;
};
