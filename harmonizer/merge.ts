import { immutableReleaseProperties, immutableTrackProperties } from './properties.ts';
import { guessTypesForRelease, mergeTypes } from './release_types.ts';
import { isDefined } from '@/utils/predicate.ts';
import { cloneInto, copyTo, filterErrorEntries, isFilled, uniqueMappedValues } from '@/utils/record.ts';
import { matchBySimilarName, similarNames } from '@/utils/similarity.ts';
import { trackCountSummary } from '@/utils/tracklist.ts';
import { assert } from 'std/assert/assert.ts';

import type {
	ArtistCreditName,
	CountryCode,
	ExternalEntityId,
	HarmonyRelease,
	ImmutableTrackProperty,
	Label,
	PreferenceProperty,
	ProviderMessage,
	ProviderName,
	ProviderPreferences,
	ProviderReleaseErrorMap,
	ProviderReleaseMap,
	ReleaseGroupType,
	ResolvableEntity,
} from './types.ts';

/**
 * Merges the given release data from different providers into a single, combined release.
 * @param releaseMap - Source releases from different providers.
 * @param preferences - Preferred providers for the whole release or individual properties.
 * @returns Merged release (with immutable properties from their preferred providers as well as some combined properties).
 */
export function mergeRelease(
	releaseMap: ProviderReleaseErrorMap,
	preferences: ProviderPreferences | ProviderName[] = {},
): HarmonyRelease {
	assertReleaseCompatibility(filterErrorEntries(releaseMap));

	const availableProviders: ProviderName[] = Object.entries(releaseMap)
		.filter(([_providerName, releaseOrError]) => !(releaseOrError instanceof Error))
		.map(([providerName]) => providerName);

	const providerErrors = Object.entries(releaseMap)
		.filter(([_providerName, releaseOrError]) => releaseOrError instanceof Error) as [ProviderName, Error][];

	if (availableProviders.length === 0) {
		throw new AggregateError(
			providerErrors.map(([_providerName, error]) => error),
			'No provider returned a release',
		);
	}

	const errorMessages: ProviderMessage[] = providerErrors.map(([providerName, error]) => ({
		provider: providerName,
		text: error.message,
		type: 'error',
	}));

	// create an empty merge target
	const mergedRelease: HarmonyRelease = {
		title: '',
		artists: [],
		externalLinks: [],
		media: [],
		types: [],
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

	// temporary list of all release group types
	const releaseGroupTypes = new Array<Iterable<ReleaseGroupType>>();

	orderByPreference(availableProviders, preferredProviders);

	// Phase 1: Clone properties without specific provider preferences
	for (const providerName of availableProviders) {
		const sourceRelease = releaseMap[providerName] as HarmonyRelease;

		// Clone missing properties into the merge target and keep track of their sources.
		missingReleaseProperties.forEach((property) => {
			const value = cloneInto(mergedRelease, sourceRelease, property);

			if (isFilled(value)) {
				mergedRelease.info.sourceMap![property] = providerName;
				missingReleaseProperties.delete(property);
			}
		});

		// As long as the merged release does not have media, nothing will happen here.
		if (mergedRelease.media.length && sourceRelease.media.length) {
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

		// Merge release group types
		if (sourceRelease.types) {
			releaseGroupTypes.push(sourceRelease.types);
		}

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

	// guess types from titles and merge all release types
	releaseGroupTypes.push(guessTypesForRelease(mergedRelease));
	mergedRelease.types = mergeTypes(...releaseGroupTypes);

	// assign temporary sets to the merge target
	if (availableRegions.size) {
		mergedRelease.availableIn = Array.from(availableRegions);
		mergedRelease.excludedFrom = Array.from(excludedRegions);
	}

	// Phase 2: Clone individual properties from their preferred providers
	if (!preferSameProvider) {
		(Object.entries(preferences) as [PreferenceProperty, ProviderName[]][])
			.forEach(([property, preferredProviders]) => {
				if (property === 'media' || property === 'externalId') {
					// handled during phase 1 and phase 3
					return;
				}

				orderByPreference(availableProviders, preferredProviders);

				for (const providerName of availableProviders) {
					const sourceRelease = releaseMap[providerName] as HarmonyRelease;

					if (isTrackProperty(property)) {
						if (!sourceRelease.media.length) continue;

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
						const value = cloneInto(mergedRelease, sourceRelease, property);

						if (isFilled(value)) {
							mergedRelease.info.sourceMap![property] = providerName;
							break;
						}
					}
				}
			});
	}

	// Phase 3: Merge properties which have a custom merge algorithm
	if (!preferSameProvider && preferences.externalId) {
		orderByPreference(availableProviders, preferences.externalId);
	}
	const availableSourceReleases = availableProviders.map((providerName) => releaseMap[providerName] as HarmonyRelease);

	// Combine external IDs of matching artist credits.
	mergeArtistCredit(mergedRelease.artists, availableSourceReleases.map((release) => release.artists));
	mergedRelease.media.forEach((medium, mediumIndex) => {
		medium.tracklist.forEach((track, trackIndex) => {
			if (track.artists) {
				mergeArtistCredit(
					track.artists,
					availableSourceReleases
						.filter((release) => release.media.length)
						.map((release) => release.media[mediumIndex].tracklist[trackIndex].artists),
				);
			}
		});
	});

	// Combine external IDs of matching labels.
	if (mergedRelease.labels) {
		mergeLabels(mergedRelease.labels, availableSourceReleases.map((release) => release.labels));
	}

	// Keep external recording IDs from all providers.
	mergedRelease.media.forEach((medium, mediumIndex) => {
		medium.tracklist.forEach((track, trackIndex) => {
			if (track.recording) { // should exist by now
				const recordingIds = availableSourceReleases
					.filter((release) => release.media.length)
					.flatMap((release) => release.media[mediumIndex].tracklist[trackIndex].recording?.externalIds)
					.filter(isDefined);
				if (recordingIds) {
					track.recording.externalIds = recordingIds;
				}
			}
		});
	});

	return mergedRelease;
}

function mergeArtistCredit(target: ArtistCreditName[], sources: Array<ArtistCreditName[] | undefined>) {
	mergeResolvableEntityArray(target, sources);
}

function mergeLabels(target: Label[], sources: Array<Label[] | undefined>) {
	mergeResolvableEntityArray(target, sources);
}

/**
 * Combines the external IDs of matching resolvable entities.
 *
 * All entity arrays must have the same length and order.
 */
export function mergeSortedResolvableEntityArray<T extends ResolvableEntity>(
	target: T[],
	sources: Array<T[] | undefined>,
) {
	target.forEach((targetItem, index) => {
		const externalIds = new Map<string, ExternalEntityId>();
		if (targetItem.externalIds?.length) {
			for (const externalId of targetItem.externalIds) {
				externalIds.set(makeEntityIdKey(externalId), externalId);
			}
		}
		for (const source of sources) {
			if (!source || source.length !== target.length) continue;
			const sourceItem = source[index];
			if (
				sourceItem.externalIds?.length &&
				sourceItem.name && targetItem.name &&
				similarNames(sourceItem.name, targetItem.name)
			) {
				for (const externalId of sourceItem.externalIds) {
					externalIds.set(makeEntityIdKey(externalId), externalId);
				}
			}
		}
		targetItem.externalIds = [...externalIds.values()];
	});
}

/**
 * Combines the external IDs of matching resolvable entities.
 *
 * Entity arrays can have an arbitrary length and order as long as the names of individual entities can be matched.
 */
export function mergeResolvableEntityArray<T extends ResolvableEntity>(target: T[], sources: Array<T[] | undefined>) {
	target.forEach((targetItem) => {
		const externalIds = new Map<string, ExternalEntityId>();
		if (targetItem.externalIds?.length) {
			for (const externalId of targetItem.externalIds) {
				externalIds.set(makeEntityIdKey(externalId), externalId);
			}
		}
		for (const source of sources) {
			if (!source?.length) continue;
			const matchingSourceItem = matchBySimilarName(targetItem, source, (item) => item.name);
			if (matchingSourceItem?.externalIds?.length) {
				for (const externalId of matchingSourceItem.externalIds) {
					externalIds.set(makeEntityIdKey(externalId), externalId);
				}
			}
		}
		targetItem.externalIds = [...externalIds.values()];
	});
}

function makeEntityIdKey(entityId: ExternalEntityId): string {
	const { provider, type, id } = entityId;
	return [provider, type, id].join('\n');
}

/** Ensures that the given releases are compatible and can be merged. */
function assertReleaseCompatibility(releaseMap: ProviderReleaseMap) {
	if (!Object.keys(releaseMap).length) return;

	assertUniquePropertyValue(
		(release) => (release.gtin) ? Number(release.gtin) : undefined,
		'Providers have returned multiple different GTIN',
	);

	// TODO: Support releases with the same total track count.
	assertUniquePropertyValue(
		trackCountSummary,
		'Providers have returned incompatible track lists',
	);

	function assertUniquePropertyValue<Value extends string | number>(
		propertyAccessor: (release: HarmonyRelease) => Value | undefined,
		errorDescription: string,
	) {
		const uniqueValues = uniqueMappedValues(releaseMap, propertyAccessor);
		assert(
			uniqueValues.length <= 1,
			`${errorDescription}: ${
				uniqueValues.map(
					([value, providerNames]) => `${value} (${providerNames.join(', ')})`,
				).join(', ')
			}`,
		);
	}
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
