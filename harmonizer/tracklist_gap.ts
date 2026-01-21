import type { HarmonyMedium, HarmonyTrack } from './types.ts';

/**
 * Fills gaps in the tracklist of the given medium.
 *
 * Assumes that the tracks have consecutive numbers starting with 1.
 */
export function fillTracklistGap(medium: HarmonyMedium, trackCount?: number) {
	const { tracklist } = medium;
	for (let trackIndex = 0; trackIndex < tracklist.length; trackIndex++) {
		fillGapBefore(tracklist[trackIndex], trackIndex);
	}

	function fillGapBefore(track: HarmonyTrack, index: number) {
		if (typeof track.number === 'number') {
			const missingTrackCount = track.number - index - 1;
			if (missingTrackCount > 0) {
				const missingTracks = new Array<HarmonyTrack>(missingTrackCount).fill({ title: '[unknown]' });
				tracklist.splice(index, 0, ...missingTracks);
			}
		}
	}
}
