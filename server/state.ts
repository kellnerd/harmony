import type { ReleaseInfo } from '@/harmonizer/types.ts';
import { isDefined } from '@/utils/predicate.ts';

export function createReleasePermalink(info: ReleaseInfo, baseUrl: URL): URL {
	const providersLookedUpByGtin = info.providers.filter((provider) => provider.lookup.method === 'gtin');
	const providersLookedUpByUrl = info.providers.filter((provider) => provider.lookup.method === 'id');
	const usedRegion = info.providers.map((provider) => provider.lookup.region).find(isDefined);
	const cacheTimestamps = info.providers.map((provider) => provider.cacheTime).filter(isDefined);

	// Add provider URLs for all providers which were looked up by URL.
	// TODO: Support lookup by `provider=id` pairs to get shorter permalinks.
	const state = new URLSearchParams(providersLookedUpByUrl.map((provider) => ['url', provider.url.href]));
	if (providersLookedUpByGtin.length) {
		state.append('gtin', providersLookedUpByGtin[0].lookup.value);
		// Add all enabled providers which were looked up by GTIN (with empty provider ID value).
		for (const provider of providersLookedUpByGtin) {
			state.append(provider.name, '');
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
