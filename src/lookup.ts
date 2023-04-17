import DeezerProvider from './providers/Deezer.ts';
import { LookupError } from './utils/errors.ts';
import { zipObject } from 'utils/object/zipObject.js';

import type MetadataProvider from './providers/abstract.ts';
import type { GTIN, HarmonyRelease, ProviderReleaseMapping, ReleaseOptions } from './providers/common.ts';

const providers: MetadataProvider<unknown>[] = [
	DeezerProvider,
].map((Provider) => new Provider());

const providerNames = providers.map((provider) => provider.name);

/**
 * Looks up the given URL with the first matching provider.
 */
export function getReleaseByUrl(url: URL, options?: ReleaseOptions): Promise<HarmonyRelease> {
	const matchingProvider = providers.find((provider) => provider.supportsDomain(url));

	if (!matchingProvider) {
		throw new LookupError(`No provider supports ${url}`);
	}

	return matchingProvider.getRelease(url, options);
}

/**
 * Looks up the given GTIN with each provider.
 */
export async function getProviderReleaseMapping(gtin: GTIN, options?: ReleaseOptions): Promise<ProviderReleaseMapping> {
	const releasePromises = providers.map((provider) => provider.getReleaseByGTIN(gtin, options));
	const releaseResults = await Promise.allSettled(releasePromises);
	const releases = releaseResults.map((result) => result.status === 'fulfilled' ? result.value : undefined);

	return zipObject(providerNames, releases);
}
