import type { CountryCode, HarmonyRelease } from '@/harmonizer/types.ts';
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
export function buildAnnotation(release: HarmonyRelease, include: AnnotationIncludes = {}): string {
	const sections: string[] = [];

	if (include.copyright && release.copyright) {
		sections.push(`Copyright: ${release.copyright}`);
	}
	if (include.textCredits && release.credits) {
		sections.push(`=== Credits from ${(release.info.sourceMap?.credits)!} ===`, release.credits);
	}
	if (include.availability) {
		const { availableIn, excludedFrom } = release;
		const releaseEventCount = determineReleaseEventCountries(release)?.length;
		// Skip if all available regions have been preserved as release events.
		if (availableIn?.length !== releaseEventCount) {
			// Skip if the list would be the equivalent of one worldwide release event.
			if (availableIn?.length && releaseEventCount !== 1) {
				sections.push(...formatAvailability(availableIn, 'Available Regions'));
			}
			if (excludedFrom?.length) {
				sections.push(...formatAvailability(excludedFrom, 'Excluded Regions'));
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
export function formatAvailability(regions: CountryCode[], heading: string): string[] {
	return [
		`=== ${heading} ===`,
		formatRegionList(regions),
	];
}
