import type { HarmonyRelease } from '@/harmonizer/types.ts';
import { plural } from '@/utils/plural.ts';

/** Converts an array of track numbers to track range strings. */
export function toTrackRanges(trackNumbers: number[]): string[] {
	if (!trackNumbers.length) return [];

	const ranges: string[] = [];
	let start: number | undefined;
	let last: number | undefined;
	for (const trackNumber of trackNumbers) {
		if (start === undefined || last === undefined) {
			start = last = trackNumber;
		} else if (trackNumber === last + 1) {
			last++;
		} else {
			ranges.push([start, last].join('-'));
			start = last = trackNumber;
		}
	}
	ranges.push([start, last].join('-'));

	return ranges;
}

/** Creates a per medium track count summary for the given release. */
export function trackCountSummary(release: HarmonyRelease): string {
	const trackCounts = release.media.map((medium) => medium.tracklist.length);
	if (!trackCounts.length) {
		// Release with media has 0 tracks.
		trackCounts.push(0);
	}
	const totalTrackCount = trackCounts.reduce((sum, current) => sum + current, 0);

	return `${trackCounts.join('+')} ${plural(totalTrackCount, 'track')}`;
}
