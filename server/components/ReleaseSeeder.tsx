import InputWithOverlay from './InputWithOverlay.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import { createReleaseSeed } from '@/musicbrainz/seeding.ts';
import { preferArray } from 'utils/array/scalar.js';

import type { HarmonyRelease } from '@/harmonizer/types.ts';

export function ReleaseSeeder({ release, sourceUrl, targetUrl, projectUrl }: {
	release: HarmonyRelease;
	projectUrl: URL;
	sourceUrl?: URL;
	targetUrl: URL;
}) {
	const seed = createReleaseSeed(release, {
		projectUrl,
		redirectUrl: sourceUrl && new URL('release/actions', sourceUrl),
		seederUrl: sourceUrl,
	});

	return (
		<form action={targetUrl.href} method='post' target='_blank' name='release-seeder'>
			{Object.entries(seed).flatMap(([key, valueOrValues]) => {
				return preferArray(valueOrValues).map((value) => <input type='hidden' name={key} value={value} />);
			})}
			<InputWithOverlay type='submit' value='Import into MusicBrainz'>
				<SpriteIcon name='database-import' />
			</InputWithOverlay>
		</form>
	);
}
