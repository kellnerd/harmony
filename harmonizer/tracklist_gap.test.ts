import { isDefined } from '@/utils/predicate.ts';
import { describe, it } from '@std/testing/bdd';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { fillTracklistGaps } from './tracklist_gap.ts';
import type { HarmonyMedium } from './types.ts';

describe('fillTracklistGap', () => {
	itFills('missing track in a sequence', 1, 2, undefined, 4, 5);
	itFills('multiple gaps in a sequence', 1, undefined, 3, undefined, 5);
	itFills('gap of multiple tracks', 1, 2, undefined, undefined, 5);
	itFills('missing tracks at the beginning', undefined, undefined, 3, 4);
	it('fills missing tracks at the end for a known track count', () => {
		const medium = fakeMedium(1, 2);
		const expectedMedium = fakeMedium(1, 2, undefined, undefined);
		fillTracklistGaps(medium, 4);
		assertEquals(medium, expectedMedium);
	});
	it('handles a combination of all of the above', () => {
		const medium = fakeMedium(2, 5, 7);
		const expectedMedium = fakeMedium(undefined, 2, undefined, undefined, 5, undefined, 7, undefined);
		fillTracklistGaps(medium, 8);
		assertEquals(medium, expectedMedium);
	});
});

function itFills(description: string, ...trackNumbers: Array<number | undefined>) {
	it(`fills ${description}`, () => {
		const medium = fakeMedium(...trackNumbers.filter(isDefined));
		const expectedMedium = fakeMedium(...trackNumbers);
		fillTracklistGaps(medium);
		assertEquals(medium, expectedMedium);
	});
}

function fakeMedium(...trackNumbers: Array<number | undefined>): HarmonyMedium {
	return {
		tracklist: trackNumbers.map((trackNumber) => {
			if (trackNumber !== undefined) {
				return { number: trackNumber, title: `Track ${trackNumber}` };
			} else {
				return { title: '[unknown]' };
			}
		}),
	};
}
