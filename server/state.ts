import type { ReleaseLookupParameters } from '@/lookup.ts';
import type { CountryCode, ProviderNameAndId, ReleaseInfo, ReleaseOptions } from '@/harmonizer/types.ts';
import { providers } from '@/providers/mod.ts';
import { ensureValidGTIN } from '@/utils/gtin.ts';
import { isDefined, isNotEmpty } from '@/utils/predicate.ts';
import { assertCountryCode } from '@/utils/regions.ts';
import { assertTimestamp } from '@/utils/time.ts';
import { getCookies } from 'std/http/cookie.ts';

/** Encodes the given release info into release lookup state query parameters. */
export function encodeReleaseLookupState(info: ReleaseInfo): URLSearchParams {
	const providersLookedUpByGtin = info.providers.filter((provider) => provider.lookup.method === 'gtin');
	const providersLookedUpById = info.providers.filter((provider) => provider.lookup.method === 'id');
	const usedRegion = info.providers.map((provider) => provider.lookup.region).find(isDefined);
	const cacheTimestamps = info.providers.map((provider) => provider.cacheTime).filter(isDefined);

	// Add provider IDs for all providers which were looked up by ID or URL.
	const state = new URLSearchParams(
		providersLookedUpById.map((provider) => [provider.internalName, provider.id]),
	);
	if (providersLookedUpByGtin.length) {
		// In an ideal world, a GTIN is just a number, but we have providers where zero-padding matters.
		// By choosing the variant with the most zeros, more GTIN lookups should succeed on first try.
		// This is crucial to make permalinks as efficient as possible by using only cached requests.
		const gtinVariantsByLength = providersLookedUpByGtin
			.map((provider) => provider.lookup.value)
			.sort((a, b) => b.length - a.length);
		state.append('gtin', gtinVariantsByLength[0]);
		// Add all enabled providers which were looked up by GTIN (with empty provider ID value).
		for (const provider of providersLookedUpByGtin) {
			state.append(provider.internalName, '');
		}
	}
	// If a region has been used for lookup, it should be the same for all providers.
	if (usedRegion) {
		state.append('region', usedRegion);
	}
	// Maximum timestamp can be used to load the latest snapshot up to this timestamp for each provider.
	state.append('ts', Math.max(...cacheTimestamps).toFixed(0));

	return state;
}

/**
 * Creates a release lookup permalink for the given release info.
 *
 * Domain and base path of the given URL will be used.
 */
export function createReleasePermalink(info: ReleaseInfo, baseUrl: URL): URL {
	const permalink = new URL('release', baseUrl);
	permalink.search = encodeReleaseLookupState(info).toString();

	return permalink;
}

/** Default regions which will be used for lookups if no regions could be obtained otherwise. */
export const defaultRegions = ['GB', 'US', 'DE', 'JP'];

/**
 * Parses a region string from an HTML form.
 * Also accepts comma-separated regions for convenience.
 */
function parseRegions(region: string): CountryCode[] {
	return region.toUpperCase().split(',').map((code) => code.trim());
}

/**
 * Extracts all release state (parameters and options) from the given lookup URL.
 *
 * Parses and validates all form parameters and permalink parameters.
 */
export function extractReleaseLookupState(lookupUrl: URL, headers?: Headers): ReleaseLookupParameters & ReleaseOptions {
	const { searchParams } = lookupUrl;
	const cookies = headers ? getCookies(headers) : {};

	const gtin = searchParams.get('gtin')?.trim() ?? undefined;
	if (gtin) {
		ensureValidGTIN(gtin);
	}

	const urls = searchParams.getAll('url').filter(isNotEmpty)
		.map((url) => new URL(url));

	let regions = searchParams.getAll('region').filter(isNotEmpty)
		.flatMap(parseRegions);
	if (!regions.length) {
		regions = cookies.region ? parseRegions(cookies.region) : defaultRegions;
	}
	for (const countryCode of regions) {
		assertCountryCode(countryCode);
	}

	const category = searchParams.get('category');
	const requestedProviders = new Set(category ? providers.filterInternalNamesByCategory(category) : undefined);

	const providerNames = providers.internalNames;
	const providerIds: ProviderNameAndId[] = [];
	for (const [name, value] of searchParams) {
		if (providerNames.has(name)) {
			requestedProviders.add(name);
			if (value) {
				providerIds.push([name, value]);
			}
		}
	}

	const ts = searchParams.get('ts') ?? '';
	let snapshotMaxTimestamp: number | undefined = undefined;
	if (ts) {
		snapshotMaxTimestamp = parseInt(ts);
		assertTimestamp(snapshotMaxTimestamp);
	}

	return {
		providers: requestedProviders,
		regions: new Set(regions),
		gtin,
		urls,
		providerIds,
		snapshotMaxTimestamp,
	};
}
