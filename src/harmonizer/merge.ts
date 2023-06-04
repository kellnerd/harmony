import { immutableReleaseProperties, immutableTrackProperties } from './properties.ts';

import type {
	CountryCode,
	HarmonyRelease,
	ImmutableTrackProperty,
	PreferenceProperty,
	ProviderMessage,
	ProviderName,
	ProviderPreferences,
	ProviderReleaseMapping,
} from './types.ts';

/**
 * Merges the given release data from different providers into a single, combined release.
 * @param releaseMap - Source releases from different providers.
 * @param preferences - Preferred providers for the whole release or individual properties.
 * @returns Merged release (with immutable properties from their preferred providers as well as some combined properties).
 */
export function mergeRelease(
	releaseMap: ProviderReleaseMapping,
	preferences: ProviderPreferences | ProviderName[] = {},
): HarmonyRelease | undefined {
	const availableProviders: ProviderName[] = Object.entries(releaseMap)
		.filter(([_providerName, releaseOrError]) => !(releaseOrError instanceof Error))
		.map(([providerName]) => providerName);

	if (availableProviders.length === 0) {
		return;
	}

	const errorMessages: ProviderMessage[] = Object.entries(releaseMap)
		.filter(([_providerName, releaseOrError]) => releaseOrError instanceof Error)
		.map(([providerName, error]) => ({
			provider: providerName,
			text: (error as Error).message,
			type: 'error',
		}));

	// create an empty merge target
	const mergedRelease: HarmonyRelease = {
		title: '',
		artists: [],
		externalLinks: [],
		media: [],
		info: {
			providers: [],
			messages: errorMessages,
			sourceMap: {},
		},
	};

	// check whether we prefer to use the same provider for all properties, fallback to preferred media provider
	const preferSameProvider = Array.isArray(preferences);
	const preferredProviders: ProviderName[] = preferSameProvider ? preferences : preferences.media ?? [];

	// if preferences have been specified for individual properties, copy these during a second merge phase
	const deferredProperties = new Set(preferSameProvider ? [] : Object.keys(preferences) as PreferenceProperty[]);

	// if a media preference has been specified it also acts as the main provider preference (see above)
	deferredProperties.delete('media');

	// keep track of properties which have to be copied during the initial merge phase
	const missingReleaseProperties = new Set(immutableReleaseProperties.filter((prop) => !deferredProperties.has(prop)));
	const missingTrackProperties = new Set(immutableTrackProperties.filter((prop) => !deferredProperties.has(prop)));

	// create temporary sets to speed up merging lists of regions
	const availableRegions = new Set<CountryCode>();
	const excludedRegions = new Set<CountryCode>();

	orderByPreference(availableProviders, preferredProviders);

	// Phase 1: Copy properties without specific provider preferences
	for (const providerName of availableProviders) {
		const sourceRelease = releaseMap[providerName] as HarmonyRelease;

		// copy missing properties into the merge target and keep track of their sources
		missingReleaseProperties.forEach((property) => {
			const value = copyTo(mergedRelease, sourceRelease, property);

			if (isFilled(value)) {
				mergedRelease.info.sourceMap![property] = providerName;
				missingReleaseProperties.delete(property);
			}
		});

		// as long as the merged release does not have media, nothing will happen here
		if (mergedRelease.media.length) {
			missingTrackProperties.forEach((property) => {
				mergedRelease.media.forEach((medium, mediumIndex) => {
					medium.tracklist.forEach((track, trackIndex) => {
						copyTo(track, sourceRelease.media[mediumIndex].tracklist[trackIndex], property);
					});
				});

				// Assume that if one track is filled, most of the other tracks are also filled.
				// This is better than overwriting all tracks with data again just because e.g. one track was not filled.
				// Filling each track separately using data from multiple providers leads to potentially inconsistent data.
				if (mergedRelease.media.some((medium) => medium.tracklist.some((track) => isFilled(track[property])))) {
					mergedRelease.info.sourceMap![property] = providerName;
					missingTrackProperties.delete(property);
				}
			});
		}

		// keep external links and info for all providers
		mergedRelease.externalLinks.push(...sourceRelease.externalLinks);
		mergedRelease.info.providers.push(...sourceRelease.info.providers);
		mergedRelease.info.messages.push(...sourceRelease.info.messages);

		// combine availabilities
		sourceRelease.availableIn?.forEach((region) => {
			availableRegions.add(region);
			excludedRegions.delete(region);
		});
		sourceRelease.excludedFrom?.forEach((region) => {
			// make sure the current region is not available through another provider
			if (!availableRegions.has(region)) {
				excludedRegions.add(region);
			}
		});
	}

	// assign temporary sets to the merge target
	if (availableRegions.size) {
		mergedRelease.availableIn = Array.from(availableRegions);
		mergedRelease.excludedFrom = Array.from(excludedRegions);
	}

	// when all properties should be taken from the same provider, we are done
	if (preferSameProvider) {
		return mergedRelease;
	}

	// Phase 2: Copy individual properties from their preferred providers
	(Object.entries(preferences) as [PreferenceProperty, ProviderName[]][]).forEach(([property, preferredProviders]) => {
		if (property === 'media') {
			// already handled during the initial merge phase
			return;
		}

		orderByPreference(availableProviders, preferredProviders);

		for (const providerName of availableProviders) {
			const sourceRelease = releaseMap[providerName] as HarmonyRelease;

			if (isTrackProperty(property)) {
				mergedRelease.media.forEach((medium, mediumIndex) => {
					medium.tracklist.forEach((track, trackIndex) => {
						copyTo(track, sourceRelease.media[mediumIndex].tracklist[trackIndex], property);
					});
				});

				if (mergedRelease.media.some((medium) => medium.tracklist.some((track) => isFilled(track[property])))) {
					mergedRelease.info.sourceMap![property] = providerName;
					break;
				}
			} else {
				const value = copyTo(mergedRelease, sourceRelease, property);

				if (isFilled(value)) {
					mergedRelease.info.sourceMap![property] = providerName;
					break;
				}
			}
		}
	});

	return mergedRelease;
}

/** Copies properties between records of the same type. Helper to prevent type errors. */
function copyTo<T>(target: T, source: T, property: keyof T) {
	return target[property] = source[property];
}

/** Checks whether the given value is an empty object (or array). */
function isEmptyObject(value: unknown): boolean {
	return typeof value === 'object' && value !== null && Object.keys(value).length === 0;
}

function isFilled(value: unknown): boolean {
	return value !== undefined && !isEmptyObject(value);
}

function isTrackProperty(property: PreferenceProperty): property is ImmutableTrackProperty {
	return immutableTrackProperties.includes(property as ImmutableTrackProperty);
}

/**
 * Sorts the given items according to the given order of preference.
 * The remaining items will be kept at the end of the sorted array.
 */
function orderByPreference<T>(items: T[], preference: T[]) {
	if (!preference.length) {
		// no preferences, nothing to sort
		return;
	}

	items.sort((a, b) => {
		const orderA = preference.indexOf(a);
		const orderB = preference.indexOf(b);
		if (orderA === -1 || orderB === -1) {
			// preference for one of the items was not specified, -1 would be sorted first, but we want them last
			return orderB - orderA;
		} else {
			return orderA - orderB;
		}
	});
}
