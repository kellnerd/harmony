import { HarmonyRelease } from '@/harmonizer/types.ts';

export function MagicISRC({ release, targetMbid }: { release: HarmonyRelease; targetMbid?: string }) {
	const allTracks = release.media.flatMap((medium) => medium.tracklist);
	if (!allTracks.some((track) => track.isrc)) {
		return <></>;
	}

	const query = new URLSearchParams(
		allTracks.map((track, index) => [`isrc${index + 1}`, track.isrc ?? '']),
	);
	if (targetMbid) {
		query.set('mbid', targetMbid);
	}
	const submissionUrl = new URL('https://magicisrc.kepstin.ca');
	submissionUrl.search = query.toString();

	return <a class='magic-isrc' href={submissionUrl.href}>Open with MagicISRC</a>;
}
