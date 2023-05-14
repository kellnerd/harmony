import DeezerProvider from './providers/Deezer.ts';
import iTunesProvider from './providers/iTunes.ts';

import type { ProviderPreferences } from './harmonizer/types.ts';
import type { MetadataProvider } from './providers/abstract.ts';

const cacheName = 'providers-v1';
const cache = await caches.open(cacheName);

export const providers: MetadataProvider<unknown>[] = [
	DeezerProvider,
	iTunesProvider,
].map((Provider) => new Provider({ cache }));

export const providerNames = providers.map((provider) => provider.name);

export const providerPreferences: ProviderPreferences = {
	// get track durations from the provider with the highest precision
	duration: sortProvidersByQuality('durationPrecision'),
};

/** Returns a list of provider names sorted by the value of the given numeric property (descending). */
function sortProvidersByQuality(property: NumericKeys<MetadataProvider<unknown>>): string[] {
	return providers
		.map((provider) => ({
			name: provider.name,
			quality: provider[property],
		}))
		.sort((a, b) => b.quality - a.quality)
		.map((provider) => provider.name);
}

// https://stackoverflow.com/a/73025031
type NumericKeys<T> = {
	[K in keyof T]: T[K] extends number ? K : never;
}[keyof T];
