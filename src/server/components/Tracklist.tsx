import { ArtistCredit } from './ArtistCredit.tsx';
import { ISRC } from './ISRC.tsx';
import { formatDuration } from '../../utils/time.ts';

import type { HarmonyMedium } from '../../harmonizer/types.ts';

type Props = {
	medium: HarmonyMedium;
	showTitle?: boolean;
};

export function Tracklist({ medium, showTitle = false }: Props) {
	return (
		<table class='tracklist'>
			{showTitle && (
				<caption>
					{medium.format ?? 'Medium'} {medium.number}{medium.title && `: ${medium.title}`}
				</caption>
			)}
			<thead>
				<tr>
					<th>Track</th>
					<th>Title</th>
					<th>Artists</th>
					<th>Duration</th>
					<th>ISRC</th>
					<th>Availability</th>
				</tr>
			</thead>
			{medium.tracklist.map((track) => {
				const regions = track.availableIn;
				return (
					<tr>
						<td>{track.number}</td>
						<td>{track.title}</td>
						<td>{track.artists && <ArtistCredit artists={track.artists} />}</td>
						<td>{formatDuration(track.duration)}</td>
						<td>
							{track.isrc && <ISRC code={track.isrc} />}
						</td>
						<td>
							{regions
								? (
									<>
										<abbr title={regions.join(', ')}>{regions.length}</abbr> regions
									</>
								)
								: '&ndash;'}
						</td>
					</tr>
				);
			})}
		</table>
	);
}
