import { SpriteIcon } from './SpriteIcon.tsx';

import { musicbrainzTargetServer } from '@/config.ts';
import type { HarmonyTrack, MergedHarmonyRelease, ProviderInfo } from '@/harmonizer/types.ts';
import { join } from 'std/url/join.ts';
import type { EntityWithMbid } from '@kellnerd/musicbrainz/api-types';

// TODO: incomplete type, expose a suitable type from @kellnerd/musicbrainz?
export interface EntityWithISRCs extends EntityWithMbid {
	isrcs?: string[];
}

function getISRCProvider(release: MergedHarmonyRelease): ProviderInfo | undefined {
	const isrcSource = release.info.sourceMap.isrc;
	if (!isrcSource) return undefined;
	return release.info.providers.find((provider) => provider.name === isrcSource);
}

export function ISRCSubmission(
	{ release, targetMbid, recordingsCache }: {
		release: MergedHarmonyRelease;
		targetMbid?: string;
		recordingsCache?: EntityWithISRCs[];
	},
) {
	const isrcProvider = getISRCProvider(release);

	if (!isrcProvider) return null;
	const allTracks = release.media.flatMap((medium) => medium.tracklist);

	const needsSubmission = (track: HarmonyTrack): boolean => {
		// If there's no ISRC, nothing to submit
		if (!track.isrc) return false;

		const recordingMbid = track.recording?.mbid;
		// If there's no recording MBID, consider the ISRC as new (needs submission)
		if (!recordingMbid) return true;

		const mbEntity = recordingsCache?.find((e) => e.id === recordingMbid);
		// If MB entity is missing or doesn't include the ISRC, it's new
		return !mbEntity?.isrcs?.includes(track.isrc);
	};

	const noPendingISRCSubmissions = !allTracks.some(needsSubmission);

	if (noPendingISRCSubmissions) return null;

	return (
		<div class='action'>
			<SpriteIcon name='disc' />
			<p>
				<MagicISRC allTracks={allTracks} targetMbid={targetMbid} isrcProvider={isrcProvider} />
				: Submit ISRCs from <a href={isrcProvider.url}>{isrcProvider.name}</a> to MusicBrainz
			</p>
		</div>
	);
}

function MagicISRC(
	{ allTracks, targetMbid, isrcProvider }: {
		allTracks: HarmonyTrack[];
		targetMbid?: string;
		isrcProvider: ProviderInfo;
	},
) {
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
