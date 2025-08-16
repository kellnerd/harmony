import type { ArtistCreditName, HarmonyTrack } from '@/harmonizer/types.ts';
import { formatDuration } from '@/utils/time.ts';

export interface TracklistFormat {
	useNumber: boolean;
	useArtist: boolean;
	artistDelimiter: string;
}

/** Formats a tracklist which is compatible with the MusicBrainz track parser format. */
export function formatTracklist(tracks: HarmonyTrack[], format: Partial<TracklistFormat> = {}): string {
	return tracks.map((track, index) => {
		let line = '';
		if (format.useNumber !== false) {
			line = `${track.number ?? index + 1}. `;
		}
		line += track.title;
		if (track.artists && format.useArtist !== false) {
			line += ` ${format.artistDelimiter ?? '-'} ${joinArtistCredit(track.artists)}`;
		}
		if (track.length) {
			line += ` (${formatDuration(track.length, { showMs: false })})`;
		}
		return line;
	}).join('\n');
}

/** Combines the given artist credits into a string. */
function joinArtistCredit(
	credits: ArtistCreditName[],
): string {
	const lastIndex = credits.length - 1;
	return credits.flatMap((credit, index) => {
		const defaultJoinPhrase = (index !== lastIndex) ? (index === lastIndex - 1 ? ' & ' : ', ') : undefined;
		return [
			credit.creditedName ?? credit.name,
			credit.joinPhrase ?? defaultJoinPhrase,
		];
	}).join('');
}
