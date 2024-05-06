import { immutableReleaseProperties, immutableTrackProperties } from './properties.ts';

import type { EntityType } from '@kellnerd/musicbrainz';
import type { ReleasePackaging, ReleaseStatus } from '@kellnerd/musicbrainz/data/release';
import type { PartialDate } from '../utils/date.ts';
import type { ScriptFrequency } from '../utils/script.ts';

/** MusicBrainz entity types which Harmony supports. */
export type HarmonyEntityType = Extract<EntityType, 'release' | 'artist'>;

/** Identifier for an entity from the current metadata provider. */
export interface EntityId {
	/** Entity type as it is called by the provider. */
	type: string;
	/** Provider ID, specific per entity type. */
	id: string;
	/**
	 * Provider region where the entity is available.
	 *
	 * Only used by providers which have region-specific API endpoints or pages.
	 */
	region?: CountryCode;
	/** Preserved slug from the original entity URL. */
	slug?: string;
}

/** External identifier for an entity from a specific metadata provider. */
export interface ExternalEntityId extends EntityId {
	/** Simplified name of the provider. */
	provider: string;
}

/** Entity which may have external IDs which can be resolved to its MBID. */
export interface ResolvableEntity {
	name: string;
	externalIds?: ExternalEntityId[];
	mbid?: string;
}

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
	packaging?: ReleasePackaging;
	images?: Artwork[];
	credits?: string;
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
	number?: number | string;
	/** Track duration in milliseconds. */
	duration?: number;
	isrc?: string;
	availableIn?: CountryCode[];
};

export type ArtistCreditName = ResolvableEntity & {
	creditedName?: string;
	joinPhrase?: string;
};

type ArtistCredit = ArtistCreditName[];

export type Label = ResolvableEntity & {
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

/** ISO 3166-1 alpha-2 two letter country code (upper case). */
export type CountryCode = string;

/** Release lookup options. */
export type ReleaseOptions = Partial<{
	withSeparateMedia: boolean;
	withAllTrackArtists: boolean;
	withISRC: boolean;
	withAvailability: boolean;
	/**
	 * Ordered list of regions for which the lookup should be tried until it succeeds.
	 * Only used by providers which have region-specific API endpoints or pages.
	 */
	regions: Set<CountryCode>;
	/** Simplified names of the providers which should (additionally) be used. */
	providers: Set<string>;
	/** Lookup release using historical snapshots before the given Unix timestamp. */
	snapshotMaxTimestamp: number;
}>;

/** Methods which can be used to lookup a release. */
export type ReleaseLookupMethod = 'gtin' | 'id';

/** Parameters to lookup a release. */
export type ReleaseLookupParameters = {
	/** Lookup method, can be by GTIN or provider ID. */
	method: ReleaseLookupMethod;
	/** Lookup value, meaning depends on the lookup method. */
	value: string;
	/** Release region which was specified with the lookup method. */
	region?: CountryCode;
};

/**
 * Release specifier, which can be one of the following:
 * - Provider URL
 * - Provider ID (string)
 * - GTIN (number)
 * - Pair of release lookup method and value
 */
export type ReleaseSpecifier = URL | string | number | [ReleaseLookupMethod, string];

export type ProviderName = string;

export type ProviderNameAndId = [string, string];

/** Mapping from the provider's name to the release returned by that provider. */
export type ProviderReleaseMapping = Record<ProviderName, HarmonyRelease | Error>;

export type ImmutableTrackProperty = typeof immutableTrackProperties[number];

export type ImmutableReleaseProperty = typeof immutableReleaseProperties[number];

export type PreferenceProperty = ImmutableReleaseProperty | ImmutableTrackProperty | 'externalId';

/** Mapping from release/track properties to lists of preferred providers for these properties. */
export type ProviderPreferences = Partial<Record<PreferenceProperty, ProviderName[]>>;

export type ProviderInfo = {
	/** Display name of the provider. */
	name: ProviderName;
	/** Simplified name of the provider. */
	simpleName: string;
	/** Provider ID of the entity. */
	id: string;
	/** Provider URL of the entity. */
	url: URL;
	/** Provider API URL of the entity, if applicable. */
	apiUrl?: URL;
	/** Parameters which were used to look up the entity. */
	lookup: ReleaseLookupParameters;
	/** Processing time of the provider in milliseconds, filled automatically. */
	processingTime?: number;
	/** Date and time when the (last piece of) provider data was cached (in seconds since the UNIX epoch). */
	cacheTime?: number;
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
