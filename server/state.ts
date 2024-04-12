import type { ReleaseInfo } from '@/harmonizer/types.ts';
import { isDefined } from '@/utils/predicate.ts';

export function createReleasePermalink(info: ReleaseInfo, baseUrl: URL): URL {
	const providerUrls = info.providers.map((providerInfo) => providerInfo.url.href);
	const cacheTimestamps = info.providers.map((providerInfo) => providerInfo.cacheTime).filter(isDefined);

	const state = new URLSearchParams(providerUrls.map((url) => ['url', url]));
	// Maximum timestamp can be used to load the latest snapshot up to this timestamp for each provider.
	state.append('ts', Math.max(...cacheTimestamps).toFixed(0));

	const permalink = new URL('release', baseUrl);
	permalink.search = state.toString();

	return permalink;
}
