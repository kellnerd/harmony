import { MaybeArray } from '../utils/types.ts';

export type HarmonyRelease = {
	title: string;
	artists: ArtistCredit;
	gtin: GTIN;
	externalLink: MaybeArray<URL>;
	media: HarmonyMedium[];
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

export type Artwork = {
	url: URL;
	types?: ArtworkType[];
	comment?: string;
};

type ArtworkType = 'front' | 'back' | 'thumbnail';

/** Global Trade Item Number with 8 (EAN-8), 12 (UPC), 13 (EAN-13) or 14 digits. */
export type GTIN = number | string;

export enum DurationPrecision {
	SECONDS,
	MS,
	US,
}

export type ReleaseOptions = Partial<{
	withSeparateMedia: boolean;
	withISRC: boolean;
	withCountryAvailability: boolean;
}>;
