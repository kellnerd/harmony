import type { HarmonyRelease } from '@/harmonizer/types.ts';
import { plural } from '@/utils/plural.ts';

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
