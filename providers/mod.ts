import { FeatureQuality } from './features.ts';
import { ProviderRegistry } from './registry.ts';
import type { ProviderPreferences } from '@/harmonizer/types.ts';

import BandcampProvider from './Bandcamp/mod.ts';
import BeatportProvider from './Beatport/mod.ts';
import DeezerProvider from './Deezer/mod.ts';
import iTunesProvider from './iTunes/mod.ts';

/** Registry with all supported providers. */
export const providers = new ProviderRegistry();

// Register all providers which should be used.
providers.addMultiple(
	DeezerProvider,
	iTunesProvider,
	BandcampProvider,
	BeatportProvider,
);

/** Internal names of providers which are enabled by default (for GTIN lookups). */
export const defaultProviders = new Set(
	providers.filterInternalNames((provider) => provider.getQuality('GTIN lookup') >= FeatureQuality.PRESENT),
);

/** Recommended default preferences which sort providers by quality. */
export const defaultProviderPreferences: ProviderPreferences = {
	labels: providers.sortNamesByQuality('release label'),
	length: providers.sortNamesByQuality('duration precision'),
	images: providers.sortNamesByQuality('cover size'),
	externalId: providers.sortNamesByQuality('MBID resolving'),
};
