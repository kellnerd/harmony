import { MessageBox } from './MessageBox.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import { musicbrainzTargetServer } from '@/config.ts';
import type { HarmonyTrack, MergedHarmonyRelease, ProviderInfo, ProviderReleaseMap } from '@/harmonizer/types.ts';
import { plural } from '@/utils/plural.ts';
import { join } from 'std/url/join.ts';
import type { EntityWithMbid } from '@kellnerd/musicbrainz/api-types';

// TODO: incomplete type, expose a suitable type from @kellnerd/musicbrainz?
export interface EntityWithISRCs extends EntityWithMbid {
	isrcs?: string[];
}

/** Maximum difference (in milliseconds) between MB and ISRC provider track lengths before a warning is shown. */
const maxTrackLengthDifference = 2000;

function getISRCProvider(release: MergedHarmonyRelease): ProviderInfo | undefined {
	const isrcSource = release.info.sourceMap.isrc;
	if (!isrcSource) return undefined;
	return release.info.providers.find((provider) => provider.name === isrcSource);
}

export function ISRCSubmission(
	{ release, targetMbid, recordingsCache, providerReleaseMap }: {
		release: MergedHarmonyRelease;
		targetMbid?: string;
		recordingsCache?: EntityWithISRCs[];
		providerReleaseMap: ProviderReleaseMap;
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

	// Compare the original track lengths of MB and the ISRC provider, the merged release only has one of them.
	// Both releases have the same track counts per medium, otherwise the merger would have dropped the ISRC provider.
	const mbRelease = providerReleaseMap['MusicBrainz'];
	const isrcProviderRelease = providerReleaseMap[isrcProvider.name];
	const multipleMedia = release.media.length > 1;
	const lengthMismatchTracks: string[] = [];
	const missingLengthTracks: string[] = [];
	release.media.forEach((medium, mediumIndex) => {
		medium.tracklist.forEach((track, trackIndex) => {
			if (!needsSubmission(track)) return;
			const mbTrack = mbRelease?.media[mediumIndex]?.tracklist[trackIndex];
			const providerTrack = isrcProviderRelease?.media[mediumIndex]?.tracklist[trackIndex];
			const trackNumber = mbTrack?.number ?? trackIndex + 1;
			const trackLabel = multipleMedia ? `${medium.number ?? mediumIndex + 1}.${trackNumber}` : `${trackNumber}`;
			// Without a length on both sides there is nothing to match against, so this is treated as suspicious too.
			if (mbTrack?.length === undefined || providerTrack?.length === undefined) {
				missingLengthTracks.push(trackLabel);
			} else if (Math.abs(mbTrack.length - providerTrack.length) > maxTrackLengthDifference) {
				lengthMismatchTracks.push(trackLabel);
			}
		});
	});

	const mbReleaseUrl = targetMbid ? join(musicbrainzTargetServer, 'release', targetMbid).href : undefined;
	const mbLink = mbReleaseUrl ? `[MusicBrainz](${mbReleaseUrl})` : 'MusicBrainz';
	const providerLink = `[${isrcProvider.name}](${isrcProvider.url})`;
	const warningSentences: string[] = [];
	if (lengthMismatchTracks.length) {
		const count = lengthMismatchTracks.length;
		warningSentences.push(
			`${plural(count, 'Track')} ${lengthMismatchTracks.join(', ')} ${plural(count, 'differs', 'differ')} ` +
				`in length by more than ${maxTrackLengthDifference / 1000} seconds between ${mbLink} and ${providerLink}.`,
		);
	}
	if (missingLengthTracks.length) {
		const count = missingLengthTracks.length;
		warningSentences.push(
			`${plural(count, 'Track')} ${missingLengthTracks.join(', ')} ${plural(count, 'has', 'have')} ` +
				`no length on ${mbLink} or ${providerLink} and could not be compared.`,
		);
	}
	if (warningSentences.length) {
		warningSentences.push('Please check that the ISRCs belong to the correct tracks before submitting them!');
	}

	return (
		<>
			<div class='action'>
				<SpriteIcon name='disc' />
				<p>
					<MagicISRC allTracks={allTracks} targetMbid={targetMbid} isrcProvider={isrcProvider} />
					: Submit ISRCs from <a href={isrcProvider.url}>{isrcProvider.name}</a> to MusicBrainz
				</p>
			</div>
			{warningSentences.length > 0 && <MessageBox message={{ type: 'warning', text: warningSentences.join(' ') }} />}
		</>
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
