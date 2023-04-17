import type { PartialDate } from '../utils/date.ts';

export type HarmonyRelease = {
	title: string;
	artists: ArtistCredit;
	gtin: GTIN;
	externalLinks: URL[];
	media: HarmonyMedium[];
	releaseDate: PartialDate;
	labels?: Label[];
	images?: Artwork[];
};

export type HarmonyMedium = {
	title?: string;
	number?: number;
	tracklist: HarmonyTrack[];
};

export type HarmonyTrack = {
	title: string;
	artists?: ArtistCredit;
	number: number | string;
	/** Track duration in milliseconds. */
	duration: number;
	isrc?: string;
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
	types?: ArtworkType[];
	comment?: string;
};

type ArtworkType = 'front' | 'back' | 'thumbnail';

/** Global Trade Item Number with 8 (EAN-8), 12 (UPC), 13 (EAN-13) or 14 digits. */
export type GTIN = number | string;

export type ReleaseOptions = Partial<{
	withSeparateMedia: boolean;
	withISRC: boolean;
	withCountryAvailability: boolean;
}>;

/** Mapping from the provider's name to the release returned by that provider. */
export type ProviderReleaseMapping = Record<string, HarmonyRelease | undefined>;
