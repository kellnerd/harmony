import { setupAlternativeValues } from './AlternativeValues.tsx';
import { ArtistCredit } from './ArtistCredit.tsx';
import { ISRC } from './ISRC.tsx';
import { LinkedEntity } from './LinkedEntity.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import { pluralWithCount } from '@/utils/plural.ts';
import { mapValues } from '@/utils/record.ts';
import { flagEmoji } from '@/utils/regions.ts';
import { formatDuration } from '@/utils/time.ts';

import type { HarmonyMedium, ProviderName } from '@/harmonizer/types.ts';

export type TracklistProps = {
	medium: HarmonyMedium;
	mediumMap?: Record<ProviderName, HarmonyMedium | undefined>;
	showTitle?: boolean;
};

function mediumCaption(medium?: HarmonyMedium) {
	if (!medium) return;

	let caption = medium.format ?? 'Medium';
	if (medium.number) caption += ` ${medium.number}`;
	if (medium.title) caption += `: ${medium.title}`;

	return caption;
}

export function Tracklist({ medium, mediumMap, showTitle = false }: TracklistProps) {
	const AlternativeValues = setupAlternativeValues(mediumMap);

	return (
		<table class='tracklist'>
			{showTitle && (
				<caption>
					{mediumCaption(medium)}
					<AlternativeValues property={mediumCaption} />
				</caption>
			)}
			<thead>
				<tr>
					<th>Track</th>
					<th>Title</th>
					<th>Artists</th>
					<th>Length</th>
					<th>ISRC</th>
					{medium.tracklist.some((track) => track.availableIn) && <th>Availability</th>}
				</tr>
			</thead>
			{medium.tracklist.map((track, index) => {
				const regions = track.availableIn;

				const trackMap = mediumMap && mapValues(mediumMap, (medium) => medium?.tracklist[index]);
				const AlternativeValues = setupAlternativeValues(trackMap);

				return (
					<tr>
						<td class='numeric'>{track.number}</td>
						<td>
							{track.type === 'video' && (
								<span title='Video'>
									<SpriteIcon name='video' size={20} stroke={1.5} />
								</span>
							)}
							{track.recording
								? <LinkedEntity entity={track.recording} entityType='recording' displayName={track.title} />
								: track.title}
							<AlternativeValues property={(track) => track?.title} />
						</td>
						<td>
							{track.artists && (
								<>
									<ArtistCredit artists={track.artists} />
									<AlternativeValues
										property={(track) => track?.artists}
										display={(artists) => <ArtistCredit artists={artists} />}
										identifier={(artists) => artists.map((artist) => artist.creditedName ?? artist.name).join('\n')}
									/>
								</>
							)}
						</td>
						<td class='numeric'>
							{formatDuration(track.length, { showMs: true })}
							<AlternativeValues
								property={(track) => track?.length}
								display={formatDuration}
								identifier={(ms) => Math.round(ms / 1000).toFixed(0)}
							/>
						</td>
						<td>
							{track.isrc && <ISRC code={track.isrc} />}
						</td>
						{regions && (
							<td>
								<span class='label'>
									<abbr title={regions.map(flagEmoji).join(' ')}>{pluralWithCount(regions.length, 'region')}</abbr>
								</span>
							</td>
						)}
					</tr>
				);
			})}
		</table>
	);
}
