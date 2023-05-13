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
	duration: providers
		.map((provider) => ({
			name: provider.name,
			precision: provider.durationPrecision,
		}))
		.sort((a, b) => b.precision - a.precision)
		.map((provider) => provider.name),
};
