import type { ReleaseInfo } from '@/harmonizer/types.ts';
import { isDefined } from '@/utils/predicate.ts';
import { simplifyName } from 'utils/string/simplify.js';

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
