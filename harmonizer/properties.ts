import type { HarmonyRelease } from './types.ts';

/** Release properties which can be combined from data of multiple providers. */
export const combinableReleaseProperties: Array<keyof HarmonyRelease> = [
	'externalLinks',
	'availableIn',
	'excludedFrom',
	'info',
];

/**
 * Release properties which have to be taken from one provider and can not be combined from data of multiple providers.
 * Except for `title` (mandatory), `artists` and `media` (array) these are optional and might be missing for a provider.
 */
export const immutableReleaseProperties = [
	'title',
	'artists',
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
] as const;

/** Track properties which have to be taken from one provider and can not be combined from data of multiple providers. */
export const immutableTrackProperties = [
	'isrc',
	'duration',
] as const;
