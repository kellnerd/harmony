import { HarmonyRelease, ProviderName, ProviderPreferences, ProviderReleaseMapping, ReleaseProperty } from './types.ts';

/**
 * Merges the given release data from different providers into a single release.
 * @param releaseMap - Source releases from different providers.
 * @param preferences - Preferred providers for the whole release or individual properties.
 * @returns Merged release (has external links for all providers).
 */
export function mergeRelease(
	releaseMap: ProviderReleaseMapping,
	preferences: ProviderPreferences | ProviderName[] = {},
): HarmonyRelease | undefined {
	const availableProviders: ProviderName[] = Object.entries(releaseMap)
		.filter(([_providerName, release]) => release)
		.map(([providerName, _release]) => providerName);

	if (availableProviders.length === 0) {
		return;
	} else if (availableProviders.length === 1) {
		return Object.values(releaseMap)[0];
	}

	// check whether we prefer to use the same provider for all properties, fallback to preferred media provider
	const preferSameProvider = Array.isArray(preferences);
	const preferredProviders: ProviderName[] = preferSameProvider ? preferences : preferences.media ?? [];

	// select the first available provider from the preferred providers and use its data as a basis
	const primaryProviderName = availableProviders.find((name) => preferredProviders.includes(name)) ??
		availableProviders[0];
	const mergedRelease = releaseMap[primaryProviderName]!;

	// keep external links for all providers
	availableProviders.forEach((providerName) => {
		if (providerName === primaryProviderName) return;

		const release = releaseMap[providerName]!;

		mergedRelease.externalLinks.push(...release.externalLinks);
	});

	// when all properties should be taken from the same provider, we are done
	if (preferSameProvider) {
		return mergedRelease;
	}

	// copy individual properties from their preferred providers
	(Object.entries(preferences) as [ReleaseProperty, ProviderName[]][]).forEach(([property, preferredProviders]) => {
		if (property === 'media' || property === 'externalLinks') return;

		const provider = availableProviders.find((name) => preferredProviders.includes(name)) ?? availableProviders[0];
		const sourceRelease = releaseMap[provider]!;

		if (property === 'isrc' || property === 'duration') {
			mergedRelease.media.forEach((medium, mediumIndex) => {
				medium.tracklist.forEach((track, trackIndex) => {
					copyTo(track, sourceRelease.media[mediumIndex].tracklist[trackIndex], property);
				});
			});
		} else {
			copyTo(mergedRelease, sourceRelease, property);
		}
	});

	return mergedRelease;
}

/** Copies properties between records of the same type. Helper to prevent type errors. */
function copyTo<T>(target: T, source: T, property: keyof T) {
	target[property] = source[property];
}

/**
 * Sorts the given providers by the given order of preference.
 * The remaining providers will be kept at the end of the sorted array.
 */
function sortProviders(providers: ProviderName[], preferredProviders: ProviderName[]) {
	providers.sort((a, b) => {
		const orderA = preferredProviders.indexOf(a);
		const orderB = preferredProviders.indexOf(b);
		if (orderA === -1 || orderB === -1) {
			// preference for one of the items was not specified, -1 would be sorted first, but we want them last
			return orderB - orderA;
		} else {
			return orderA - orderB;
		}
	});
}
