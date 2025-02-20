import { musicbrainzTargetServer } from '@/config.ts';
import type { HarmonyRelease } from '@/harmonizer/types.ts';
import { join } from 'std/url/join.ts';

export function MagicISRC({ release, targetMbid }: { release: HarmonyRelease; targetMbid?: string }) {
	const allTracks = release.media.flatMap((medium) => medium.tracklist);
	const isrcSource = release.info.sourceMap?.isrc;
	const isrcProvider = release.info.providers.find((provider) => provider.name === isrcSource);
	if (!(allTracks.some((track) => track.isrc) && isrcProvider)) {
		return <></>;
	}

	const query = new URLSearchParams(
		allTracks.map((track, index) => [`isrc${index + 1}`, track.isrc ?? '']),
	);
	let editNote = `Import ISRCs from ${isrcProvider.url.href}`;
	if (targetMbid) {
		const releaseUrl = join(musicbrainzTargetServer, 'release', targetMbid);
		editNote += ` to ${releaseUrl.href}`;
		query.set('musicbrainzid', targetMbid);
	}
	query.set('edit-note', editNote);

	const submissionUrl = new URL('https://magicisrc.kepstin.ca');
	submissionUrl.search = query.toString();

	return <a class='magic-isrc' href={submissionUrl.href}>Open with MagicISRC</a>;
}
