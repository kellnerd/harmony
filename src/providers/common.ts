import { MaybeArray } from '../utils/types';

export type HarmonyRelease = {
	title: string;
	gtin: GTIN;
	externalLink: MaybeArray<URL>;
};

/** Global Trade Item Number with 8 (EAN-8), 12 (UPC), 13 (EAN-13) or 14 digits. */
export type GTIN = number | string;
