import { CompatibilityError } from '@/utils/errors.ts';
import { uniqueMappedValues } from '@/utils/record.ts';
import { trackCountSummary } from '@/utils/tracklist.ts';
import type { HarmonyRelease, IncompatibilityInfo, ProviderName, ProviderReleaseMap } from './types.ts';

export function determineReleaseIncompatibility(
	releaseMap: ProviderReleaseMap,
	primaryProvider?: ProviderName,
): IncompatibilityInfo | undefined {
	try {
		// TODO: Probably has to be made recursive to handle multiple incompatibilities (GTIN and track count).
		assertReleaseCompatibility(releaseMap);
	} catch (error) {
		if (error instanceof CompatibilityError && primaryProvider) {
			const incompatibleData: IncompatibilityInfo = {
				reason: error.message,
				compatibleValue: '',
				clusters: [],
			};

			for (const [value, sources] of error.valuesAndSources) {
				if (sources.includes(primaryProvider)) {
					incompatibleData.compatibleValue = value;
				} else {
					incompatibleData.clusters.push({
						incompatibleValue: value,
						providers: sources.map((source) => releaseMap[source])
							.flatMap((release) => release.info.providers),
					});
				}
			}

			return incompatibleData;
		} else {
			throw error;
		}
	}
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
		if (uniqueValues.length > 1) {
			throw new CompatibilityError(errorDescription, uniqueValues);
		}
	}
}
