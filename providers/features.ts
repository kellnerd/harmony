const providerFeatures = [
	'cover size',
	'duration precision',
	'GTIN lookup',
	'MBID resolving',
] as const;

/** Features which a `MetadataProvider` can have. */
export type ProviderFeature = typeof providerFeatures[number];

/**
 * Maps feature names to their quality rating.
 *
 * Quality values are numeric and should use {@linkcode FeatureQuality}, with the following exceptions:
 * - `cover size`: Median image height in pixels
 * - `duration precision`: {@linkcode DurationPrecision}
 */
export type FeatureQualityMap = Partial<Record<ProviderFeature, number>>;

/** General quality rating of a {@linkcode ProviderFeature} which has no specific quality scale. */
export enum FeatureQuality {
	MISSING = -20,
	BAD = -10,
	UNKNOWN = 0,
	EXPENSIVE,
	PRESENT,
	GOOD,
}

/** Precision of durations. */
export enum DurationPrecision {
	UNKNOWN = 0,
	SECONDS,
	MS,
	US,
}
