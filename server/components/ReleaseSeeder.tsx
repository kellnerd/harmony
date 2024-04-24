import InputWithOverlay from './InputWithOverlay.tsx';
import IconDatabaseImport from 'tabler-icons/database-import.tsx';

import { createReleaseSeed } from '@/musicbrainz/seeding.ts';
import { preferArray } from 'utils/array/scalar.js';

import type { HarmonyRelease } from '@/harmonizer/types.ts';

export function ReleaseSeeder({ release, sourceUrl, targetUrl }: {
	release: HarmonyRelease;
	sourceUrl?: URL;
	targetUrl: URL;
}) {
	const seed = createReleaseSeed(release, sourceUrl);

	return (
		<form action={targetUrl.href} method='post' target='_blank' name='release-seeder'>
			{Object.entries(seed).flatMap(([key, valueOrValues]) => {
				return preferArray(valueOrValues).map((value) => <input type='hidden' name={key} value={value} />);
			})}
			<InputWithOverlay type='submit' value='Import into MusicBrainz'>
				<IconDatabaseImport />
			</InputWithOverlay>
		</form>
	);
}
