import DeezerProvider from './Deezer/mod.ts';
import iTunesProvider from './iTunes/mod.ts';

import { SnapStorage } from 'snap-storage';

import type { ProviderPreferences } from '../harmonizer/types.ts';
import type { MetadataProvider } from './base.ts';

const snaps = new SnapStorage();

export const providers: MetadataProvider<unknown>[] = [
	DeezerProvider,
	iTunesProvider,
].map((Provider) => new Provider({ snaps }));

export const providerNames = providers.map((provider) => provider.name);

export const providerPreferences: ProviderPreferences = {
	// get track durations from the provider with the highest precision
	duration: sortProvidersByQuality('durationPrecision'),
	// get cover art from the provider with the highest quality (currently: image resolution)
	images: sortProvidersByQuality('artworkQuality'),
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
