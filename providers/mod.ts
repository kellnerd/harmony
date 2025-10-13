import { appInfo } from '@/app.ts';
import { dataDir } from '@/config.ts';
import type { ProviderPreferences } from '@/harmonizer/types.ts';
import { ProviderRegistry } from './registry.ts';

import BandcampProvider from './Bandcamp/mod.ts';
import BeatportProvider from './Beatport/mod.ts';
import DeezerProvider from './Deezer/mod.ts';
import iTunesProvider from './iTunes/mod.ts';
import MusicBrainzProvider from './MusicBrainz/mod.ts';
import SpotifyProvider from './Spotify/mod.ts';
import TidalProvider from './Tidal/mod.ts';
import SoundCloudProvider from './SoundCloud/mod.ts';

/** Registry with all supported providers. */
export const providers = new ProviderRegistry({
	appInfo: appInfo,
	dataDir: dataDir,
});

// Register all providers which should be used.
providers.addMultiple(
	MusicBrainzProvider,
	DeezerProvider,
	iTunesProvider,
	SpotifyProvider,
	TidalProvider,
	BandcampProvider,
	BeatportProvider,
	SoundCloudProvider
);

/** Internal names of providers which are enabled by default (for GTIN lookups). */
export const defaultProviders = new Set(
	providers.filterInternalNamesByCategory('default'),
);

/** Recommended default preferences which sort providers by quality. */
export const defaultProviderPreferences: ProviderPreferences = {
	labels: providers.sortNamesByQuality('release label'),
	length: providers.sortNamesByQuality('duration precision'),
	images: providers.sortNamesByQuality('cover size'),
	externalId: providers.sortNamesByQuality('MBID resolving'),
};
