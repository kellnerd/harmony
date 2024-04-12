import DeezerProvider from './Deezer/mod.ts';
import iTunesProvider from './iTunes/mod.ts';

import { SnapStorage } from 'snap-storage';
import { assert } from 'std/testing/asserts.ts';
import { simplifyName } from 'utils/string/simplify.js';

import type { ProviderPreferences } from '@/harmonizer/types.ts';
import type { MetadataProvider } from './base.ts';

const snaps = new SnapStorage();

/** All supported (and enabled) providers. */
export const providers: MetadataProvider[] = [
	DeezerProvider,
	iTunesProvider,
].map((Provider) => new Provider({ snaps }));

/** Display names of all supported providers. */
export const allProviderNames = providers.map((provider) => provider.name);

/** Simplified names of all supported providers. */
export const allProviderSimpleNames = new Set(allProviderNames.map((name) => simplifyName(name)));

assert(
	allProviderSimpleNames.size === allProviderNames.length,
	'Provider names and their simplified versions have to be unique',
);

/** Maps simplified provider names to their metadata providers. */
export const providerMap: Record<string, MetadataProvider | undefined> = Object.fromEntries(
	providers.map((provider) => [simplifyName(provider.name), provider]),
);

export const providerPreferences: ProviderPreferences = {
	// get track durations from the provider with the highest precision
	duration: sortProvidersByQuality('durationPrecision'),
	// get cover art from the provider with the highest quality (currently: image resolution)
	images: sortProvidersByQuality('artworkQuality'),
};

/** Returns a list of provider names sorted by the value of the given numeric property (descending). */
function sortProvidersByQuality(property: NumericKeys<MetadataProvider>): string[] {
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
