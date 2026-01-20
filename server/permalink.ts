import { getMaxCacheTimestamp } from '@/harmonizer/timestamp.ts';
import type { ReleaseInfo } from '@/harmonizer/types.ts';
import { isDefined } from '@/utils/predicate.ts';

/** Options how a lookup state should be encoded. */
export interface LookupStateOptions {
	/** Include a timestamp for usage as a permalink. */
	permalink?: boolean;
}

/** Encodes the given release info into release lookup state query parameters. */
export function encodeReleaseLookupState(info: ReleaseInfo, options: LookupStateOptions = {}): URLSearchParams {
	const providersLookedUpByGtin = info.providers.filter((provider) => provider.lookup.method === 'gtin');
	const providersLookedUpById = info.providers.filter((provider) =>
		provider.lookup.method === 'id' && !provider.isTemplate
	);
	const providersUsedAsTemplate = info.providers.filter((provider) => provider.isTemplate);
	const usedRegion = info.providers.map((provider) => provider.lookup.region).find(isDefined);

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

	// Finally add the template providers and their IDs.
	for (const provider of providersUsedAsTemplate) {
		state.append(`${provider.internalName}!`, provider.id);
	}

	// If a region has been used for lookup, it should be the same for all providers.
	if (usedRegion) {
		state.append('region', usedRegion);
	}

	if (options.permalink) {
		// Maximum timestamp can be used to load the latest snapshot up to this timestamp for each provider.
		const maxTimestamp = getMaxCacheTimestamp(info);
		if (maxTimestamp) {
			state.append('ts', maxTimestamp.toFixed(0));
		}
	}

	return state;
}

/**
 * Creates a release lookup permalink for the given release info.
 *
 * Domain and base path of the given URL will be used.
 */
export function createReleasePermalink(info: ReleaseInfo, baseUrl: URL): URL {
	const permalink = new URL('release', baseUrl);
	permalink.search = encodeReleaseLookupState(info, {
		permalink: true,
	}).toString();

	return permalink;
}
