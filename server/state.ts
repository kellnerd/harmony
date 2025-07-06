import type { ReleaseLookupParameters } from '@/lookup.ts';
import type { CountryCode, ProviderNameAndId, ReleaseOptions } from '@/harmonizer/types.ts';
import { providers } from '@/providers/mod.ts';
import { ensureValidGTIN } from '@/utils/gtin.ts';
import { isNotEmpty } from '@/utils/predicate.ts';
import { assertCountryCode } from '@/utils/regions.ts';
import { assertTimestamp } from '@/utils/time.ts';
import { getCookies } from 'std/http/cookie.ts';

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
		regions = cookies.region ? parseRegions(decodeURIComponent(cookies.region)) : defaultRegions;
	}
	for (const countryCode of regions) {
		assertCountryCode(countryCode);
	}

	const category = searchParams.get('category');
	const requestedProviders = new Set(category ? providers.filterInternalNamesByCategory(category, cookies) : undefined);

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

	const ts = searchParams.get('ts');
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
