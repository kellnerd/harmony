import type { ReleaseLookupParameters } from '@/lookup.ts';
import type { ProviderNameAndId, ReleaseInfo, ReleaseOptions } from '@/harmonizer/types.ts';
import { allProviderSimpleNames } from '@/providers/mod.ts';
import { ensureValidGTIN } from '@/utils/gtin.ts';
import { isDefined, isNotEmpty } from '@/utils/predicate.ts';
import { assertCountryCode } from '@/utils/regions.ts';
import { simplifyName } from 'utils/string/simplify.js';

/**
 * Creates a release lookup permalink for the given release info.
 *
 * Domain and base path of the given URL will be used.
 */
export function createReleasePermalink(info: ReleaseInfo, baseUrl: URL): URL {
	const providersLookedUpByGtin = info.providers.filter((provider) => provider.lookup.method === 'gtin');
	const providersLookedUpById = info.providers.filter((provider) => provider.lookup.method === 'id');
	const usedRegion = info.providers.map((provider) => provider.lookup.region).find(isDefined);
	const cacheTimestamps = info.providers.map((provider) => provider.cacheTime).filter(isDefined);

	// Add provider IDs for all providers which were looked up by ID or URL.
	const state = new URLSearchParams(
		providersLookedUpById.map((provider) => [simplifyName(provider.name), provider.id]),
	);
	if (providersLookedUpByGtin.length) {
		state.append('gtin', providersLookedUpByGtin[0].lookup.value);
		// Add all enabled providers which were looked up by GTIN (with empty provider ID value).
		for (const provider of providersLookedUpByGtin) {
			state.append(simplifyName(provider.name), '');
		}
	}
	// If a region has been used for lookup, it should be the same for all providers.
	if (usedRegion) {
		state.append('region', usedRegion);
	}
	// Maximum timestamp can be used to load the latest snapshot up to this timestamp for each provider.
	state.append('ts', Math.max(...cacheTimestamps).toFixed(0));

	const permalink = new URL('release', baseUrl);
	permalink.search = state.toString();

	return permalink;
}

/** Default regions which will be used for lookups if no regions could be obtained otherwise. */
export const defaultRegions = ['GB', 'US', 'DE', 'JP'];

/**
 * Extracts all release state (parameters and options) from the given lookup URL.
 *
 * Parses and validates all form parameters and permalink parameters.
 * @todo Handle `ts` snapshot timestamp parameter.
 */
export function extractReleaseLookupState(lookupUrl: URL): ReleaseLookupParameters & ReleaseOptions {
	const { searchParams } = lookupUrl;

	const gtin = searchParams.get('gtin') ?? undefined;
	if (gtin) {
		ensureValidGTIN(gtin);
	}

	const urls = searchParams.getAll('url').filter(isNotEmpty)
		.map((url) => new URL(url));

	// Also accept comma-separated regions from HTML form for convenience.
	let regions = searchParams.getAll('region').filter(isNotEmpty)
		.flatMap((value) => value.toUpperCase().split(','));
	if (!regions.length) {
		regions = defaultRegions;
	}
	for (const countryCode of regions) {
		assertCountryCode(countryCode);
	}

	const requestedProviders = new Set<string>();
	const providerIds: ProviderNameAndId[] = [];
	for (const [name, value] of searchParams) {
		if (allProviderSimpleNames.has(name)) {
			requestedProviders.add(name);
			if (value) {
				providerIds.push([name, value]);
			}
		}
	}

	return {
		providers: requestedProviders.size ? requestedProviders : undefined,
		regions: new Set(regions),
		gtin,
		urls,
		providerIds,
	};
}
