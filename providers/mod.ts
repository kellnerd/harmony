import BandcampProvider from './Bandcamp/mod.ts';
import BeatportProvider from './Beatport/mod.ts';
import DeezerProvider from './Deezer/mod.ts';
import iTunesProvider from './iTunes/mod.ts';

import { SnapStorage } from 'snap-storage';
import { assert } from 'std/assert/assert.ts';

import type { ExternalEntityId, ProviderPreferences } from '@/harmonizer/types.ts';
import type { MetadataProvider } from './base.ts';

const snaps = new SnapStorage();

/** All supported (and enabled) providers. */
export const allProviders: MetadataProvider[] = [
	DeezerProvider,
	iTunesProvider,
	BandcampProvider,
	BeatportProvider,
].map((Provider) => new Provider({ snaps }));

/** Display names of all supported providers. */
export const allProviderNames = allProviders.map((provider) => provider.name);

/** Simplified names of all supported providers. */
export const allProviderSimpleNames = new Set(allProviders.map((provider) => provider.simpleName));

assert(
	allProviderSimpleNames.size === allProviderNames.length,
	'Provider names and their simplified versions have to be unique',
);

/** Maps simplified provider names to their metadata providers. */
export const providerMap: Record<string, MetadataProvider | undefined> = Object.fromEntries(
	allProviders.map((provider) => [provider.simpleName, provider]),
);

/** Constructs a canonical URL for the given external entity identifier. */
export function constructEntityUrl(entityId: ExternalEntityId): URL {
	const provider = providerMap[entityId.provider];
	if (!provider) {
		throw new Error(`There is no provider with the simplified name ${entityId.provider}`);
	}

	return provider.constructUrl(entityId);
}

/** Recommended default preferences which sort providers by quality. */
export const defaultProviderPreferences: ProviderPreferences = {
	// get track durations from the provider with the highest precision
	duration: sortProvidersByQuality('durationPrecision'),
	// get cover art from the provider with the highest quality (currently: image resolution)
	images: sortProvidersByQuality('artworkQuality'),
	// use region-specific external URLs last (TODO: derive this from provider properties)
	externalId: ['Deezer', 'Bandcamp', 'Beatport', 'iTunes'],
};

/** Returns a list of provider names sorted by the value of the given numeric property (descending). */
function sortProvidersByQuality(property: NumericKeys<MetadataProvider>): string[] {
	return allProviders
		.map((provider) => ({
			name: provider.name,
			quality: provider[property],
		}))
		.sort((a, b) => b.quality - a.quality)
		.map((provider) => provider.name);
}

type NumericKeys<T> = {
	[K in keyof T]-?: T[K] extends number ? K : never;
}[keyof T];
