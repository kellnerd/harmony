import { ArtistCredit } from './ArtistCredit.tsx';
import { ISRC } from './ISRC.tsx';
import { formatDuration } from '../../utils/time.ts';

import type { HarmonyMedium } from '../../harmonizer/types.ts';

export function Tracklist({ medium }: { medium: HarmonyMedium }) {
	return (
		<table class='tracklist'>
			<thead>
				<tr>
					<th>Track</th>
					<th>Title</th>
					<th>Artists</th>
					<th>Duration</th>
					<th>ISRC</th>
				</tr>
			</thead>
			{medium.tracklist.map((track) => {
				return (
					<tr>
						<td>{track.number}</td>
						<td>{track.title}</td>
						<td>{track.artists && <ArtistCredit artists={track.artists} />}</td>
						<td>{formatDuration(track.duration)}</td>
						<td>
							{track.isrc && <ISRC code={track.isrc} />}
						</td>
					</tr>
				);
			})}
		</table>
	);
}
