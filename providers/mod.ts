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

/** Recommended default preferences which sort providers by quality. */
export const defaultProviderPreferences: ProviderPreferences = {
	// Get track lengths from the provider with the highest precision.
	length: providers.sortNamesByQuality('durationPrecision'),
	// Get cover art from the provider with the highest quality (currently: image resolution).
	images: providers.sortNamesByQuality('artworkQuality'),
	// Use region-specific external URLs last (TODO: derive this from provider properties).
	externalId: ['Deezer', 'Bandcamp', 'Beatport', 'iTunes'],
};
