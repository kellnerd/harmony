import { musicbrainzTargetServer } from '@/config.ts';
import type { HarmonyRelease, ProviderInfo } from '@/harmonizer/types.ts';
import { join } from 'std/url/join.ts';
import { SpriteIcon } from './SpriteIcon.tsx';
import type { EntityWithMbid } from '@kellnerd/musicbrainz/api-types';

// TODO: incomplete type, expose a suitable type from @kellnerd/musicbrainz?
export interface EntityWithISRCs extends EntityWithMbid {
	isrcs?: string[];
}

export function ISRCSubmission(
	{ release, targetMbid, isrcProvider, recordingsCache: recordingsCache }: {
		release?: HarmonyRelease;
		targetMbid?: string;
		isrcProvider?: ProviderInfo;
		recordingsCache?: EntityWithISRCs[];
	},
) {
	if (!isrcProvider || !release) return null;
	const allTracks = release.media.flatMap((medium) => medium.tracklist);
	if (!allTracks.some((track) => track.isrc)) return null;

	const noNewISRCs = allTracks.every((track) => {
		const recordingMbid = track.recording?.mbid;

		if (!recordingMbid) return false;

		const mbEntity = recordingsCache?.find((e) => e.id === recordingMbid);
		return mbEntity?.isrcs?.includes(track.isrc!);
	});

	if (noNewISRCs) return null;

	return (
		<div class='message'>
			<SpriteIcon name='disc' />
			<p>
				<MagicISRC release={release} targetMbid={targetMbid} />
				: Submit ISRCs from <a href={isrcProvider.url}>{isrcProvider.name}</a> to MusicBrainz
			</p>
		</div>
	);
}

function MagicISRC({ release, targetMbid }: { release: HarmonyRelease; targetMbid?: string }) {
	const allTracks = release.media.flatMap((medium) => medium.tracklist);
	const isrcSource = release.info.sourceMap?.isrc;
	const isrcProvider = release.info.providers.find((provider) => provider.name === isrcSource);
	if (!(allTracks.some((track) => track.isrc) && isrcProvider)) {
		return null;
	}

	const query = new URLSearchParams(
		allTracks.map((track, index) => [`isrc${index + 1}`, track.isrc ?? '']),
	);
	let editNote = `Import ISRCs from ${isrcProvider.url}`;
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
