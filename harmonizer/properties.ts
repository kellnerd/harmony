import type { HarmonyRelease, HarmonyTrack } from './types.ts';

/** Release properties which can be combined from data of multiple providers. */
export const combinableReleaseProperties = [
	'externalLinks',
	'availableIn',
	'excludedFrom',
	'info',
] as const satisfies Array<keyof HarmonyRelease>;

/**
 * Release properties which have to be taken from one provider and can not be combined from data of multiple providers.
 * Except for `title` (mandatory), `artists` and `media` (array) these are optional and might be missing for a provider.
 */
export const immutableReleaseProperties = [
	'title',
	'artists',
	'releaseGroup',
	'gtin', // TODO: has to be missing or identical during merge
	'media', // TODO: has to be missing or of identical shape during merge
	'language',
	'script',
	'status',
	'releaseDate',
	'labels',
	'packaging',
	'images', // TODO: make images combinable? combine if not only front covers?
	'copyright',
	'credits',
] as const satisfies Array<keyof HarmonyRelease>;

/** Track properties which have to be taken from one provider and can not be combined from data of multiple providers. */
export const immutableTrackProperties = [
	'isrc',
	'length',
] as const satisfies Array<keyof HarmonyTrack>;

/** Track properties which can be combined from data of multiple providers. */
export const combinableTrackProperties = [
	'recording',
] as const satisfies Array<keyof HarmonyTrack>;
