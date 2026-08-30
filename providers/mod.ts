import { appInfo } from '@/app.ts';
import { dataDir } from '@/config.ts';
import type { ProviderPreferences } from '@/harmonizer/types.ts';
import { ProviderRegistry } from './registry.ts';

import BandcampProvider from './Bandcamp/mod.ts';
import BeatportProvider from './Beatport/mod.ts';
import DeezerProvider from './Deezer/mod.ts';
import DiscogsProvider from './Discogs/mod.ts';
import AppleMusicProvider, { isAppleMusicConfigured } from './AppleMusic/mod.ts';
import iTunesProvider from './iTunes/mod.ts';
import MusicBrainzProvider from './MusicBrainz/mod.ts';
import OtotoyProvider from './Ototoy/mod.ts';
import SpotifyProvider from './Spotify/mod.ts';
import TidalProvider from './Tidal/mod.ts';
import MoraProvider from './Mora/mod.ts';
import QobuzProvider from './Qobuz/mod.ts';
import BugsProvider from './Bugs/mod.ts';
import MelonProvider from './Melon/mod.ts';

/** Registry with all supported providers. */
export const providers = new ProviderRegistry({
	appInfo: appInfo,
	dataDir: dataDir,
});

// Register all providers which should be used.
providers.addMultiple(
	MusicBrainzProvider,
	DiscogsProvider,
	DeezerProvider,
);
// Apple Music claims music.apple.com URLs when credentials are set; otherwise iTunes handles them.
if (isAppleMusicConfigured()) {
	providers.add(AppleMusicProvider);
}
providers.addMultiple(
	iTunesProvider,
	SpotifyProvider,
	TidalProvider,
	BandcampProvider,
	QobuzProvider,
	BeatportProvider,
	MoraProvider,
	OtotoyProvider,
	BugsProvider,
	MelonProvider,
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
