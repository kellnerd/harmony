import { formatTimestampAsISODate, getMaxCacheTimestamp } from '@/harmonizer/timestamp.ts';
import type { CountryCode, HarmonyRelease, MergedHarmonyRelease } from '@/harmonizer/types.ts';
import { formatRegionList } from '@/utils/regions.ts';
import { determineReleaseEventCountries } from './release_countries.ts';
import { transform } from 'utils/string/transform.js';

/** Information which should be included in the annotation. */
export interface AnnotationIncludes {
	/** Include lists of available and excluded regions. */
	availability?: boolean;
	/** Include copyright lines. */
	copyright?: boolean;
	/** Include text-based release credits. */
	textCredits?: boolean;
}

/** Builds a MusicBrainz annotation from the given release data. */
export function buildAnnotation(
	release: HarmonyRelease | MergedHarmonyRelease,
	include: AnnotationIncludes = {},
): string {
	const sections: string[] = [];

	if (include.copyright && release.copyright) {
		sections.push(`Copyright: ${release.copyright}`);
	}
	if (include.textCredits && release.credits) {
		// In case the release is not the result of a merge, the sole provider is the source.
		const creditsSource = (release as MergedHarmonyRelease).info.sourceMap.credits ?? release.info.providers[0].name;
		sections.push(`=== Credits from ${creditsSource} ===`, release.credits);
	}
	if (include.availability) {
		const { availableIn, excludedFrom } = release;
		const releaseEventCount = determineReleaseEventCountries(release)?.length;
		// Skip if all available regions have been preserved as release events.
		if (availableIn?.length !== releaseEventCount) {
			const ts = getMaxCacheTimestamp(release.info);
			// Skip if the list would be the equivalent of one worldwide release event.
			if (availableIn?.length && releaseEventCount !== 1) {
				sections.push(...formatAvailability(availableIn, 'Available Regions', ts));
			}
			if (excludedFrom?.length) {
				sections.push(...formatAvailability(excludedFrom, 'Excluded Regions', ts));
			}
		}
	}

	const annotation = sections.join('\n\n');

	// https://musicbrainz.org/doc/Annotation#Wiki_formatting
	return transform(annotation, [
		[/\[/g, '&#91;'],
		[/\]/g, '&#93;'],
	]);
}

/** Formats the given availability data as sections for a MusicBrainz annotation. */
export function formatAvailability(regions: CountryCode[], heading: string, ts?: number): string[] {
	return [
		`=== ${heading}${ts ? ` (as of ${formatTimestampAsISODate(ts)})` : ''} ===`,
		formatRegionList(regions),
	];
}
