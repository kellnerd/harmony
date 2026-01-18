import { CompatibilityError } from '@/utils/errors.ts';
import { filterErrorEntries, uniqueMappedValues } from '@/utils/record.ts';
import { trackCountSummary } from '@/utils/tracklist.ts';
import type {
	HarmonyRelease,
	IncompatibilityInfo,
	ProviderName,
	ProviderReleaseErrorMap,
	ProviderReleaseMap,
} from './types.ts';

/**
 * Guarantees that the provider release map only contains compatible releases.
 *
 * Handles and reports all failing release compatibility checks.
 * Releases that are incompatible with the primary provider's release will be deleted from the map.
 * All incompatible providers are clustered using the value of the property which is incompatible with the primary provider.
 *
 * @throws when the releases are incompatible and no primary provider has been given.
 */
export function makeReleasesCompatible(
	releaseErrorMap: ProviderReleaseErrorMap,
	primaryProvider?: ProviderName,
): IncompatibilityInfo[] {
	const releaseMap = filterErrorEntries(releaseErrorMap);
	if (!Object.keys(releaseMap).length) {
		return [];
	}

	const incompatibilities: IncompatibilityInfo[] = [];
	let incompatibility: IncompatibilityInfo | undefined;
	do {
		incompatibility = determineReleaseIncompatibility(releaseMap, primaryProvider);
		if (incompatibility) {
			incompatibilities.push(incompatibility);
			const incompatibleProviders = incompatibility.clusters.flatMap((cluster) =>
				cluster.providers.map((provider) => provider.name)
			);
			// Delete incompatible data from the release map.
			for (const providerName of incompatibleProviders) {
				delete releaseMap[providerName];
				delete releaseErrorMap[providerName];
			}
		}
	} while (incompatibility);
	return incompatibilities;
}

/** Specification of a compatibility check for multiple entities. */
interface CompatibilityCheck<Entity> {
	/**
	 * Extracts the property which has to be compatible.
	 * The computed value has to be identical (or nullish) for all of the compared entities.
	 */
	property: (entity: Entity) => string | number | undefined;
	/** Message which explains the incompatibility. */
	errorMessage: string;
}

const releaseCompatibilityChecks: CompatibilityCheck<HarmonyRelease>[] = [{
	property: (release) => release.gtin ? Number(release.gtin) : undefined,
	errorMessage: 'Providers have returned multiple different GTIN',
}, {
	property: trackCountSummary,
	// TODO: Support releases with the same total track count.
	errorMessage: 'Providers have returned incompatible track lists',
}];

/** Determines whether the given releases are compatible and can be merged (with the primary provider's data). */
function determineReleaseIncompatibility(
	releaseMap: ProviderReleaseMap,
	primaryProvider?: ProviderName,
): IncompatibilityInfo | undefined {
	for (const check of releaseCompatibilityChecks) {
		const uniquePropertyValues = uniqueMappedValues(releaseMap, check.property);
		if (uniquePropertyValues.length > 1) {
			const incompatibleData: IncompatibilityInfo = {
				reason: check.errorMessage,
				clusters: [],
			};

			for (const [value, sources] of uniquePropertyValues) {
				if (primaryProvider && sources.includes(primaryProvider)) {
					incompatibleData.compatibleValue = value;
				} else {
					incompatibleData.clusters.push({
						incompatibleValue: value,
						providers: sources.map((source) => releaseMap[source])
							.flatMap((release) => release.info.providers),
					});
				}
			}

			if (incompatibleData.compatibleValue) {
				return incompatibleData;
			} else {
				// There is no primary provider which can be used as merge target.
				throw new CompatibilityError(check.errorMessage, incompatibleData);
			}
		}
	}
}
