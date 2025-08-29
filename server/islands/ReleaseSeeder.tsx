import InputWithOverlay from '@/server/components/InputWithOverlay.tsx';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';

import { createReleaseSeed } from '@/musicbrainz/seeding.ts';
import { checkSetting, getSetting } from '@/server/settings.ts';
import { preferArray } from 'utils/array/scalar.js';

import type { HarmonyRelease } from '@/harmonizer/types.ts';

export function ReleaseSeeder({ release, sourceUrl, targetUrl, projectUrl }: {
	release: HarmonyRelease;
	projectUrl: string;
	sourceUrl?: string;
	targetUrl: string;
}) {
	const seederSourceUrl = sourceUrl ? new URL(sourceUrl) : undefined;
	const isUpdate = targetUrl.endsWith('/edit');
	const seed = createReleaseSeed(release, {
		projectUrl: new URL(projectUrl),
		redirectUrl: (seederSourceUrl && checkSetting('seeder.redirect', true))
			? new URL('release/actions', seederSourceUrl)
			: undefined,
		seederUrl: seederSourceUrl,
		isUpdate,
		annotation: {
			availability: checkSetting('annotation.availability', false),
			copyright: checkSetting('annotation.copyright', true),
			textCredits: checkSetting('annotation.credits', true),
		},
	});

	return (
		<form
			action={targetUrl}
			method='post'
			target={getSetting('seeder.target', '_blank')}
			name={isUpdate ? 'release-update-seeder' : 'release-seeder'}
		>
			{Object.entries(seed).flatMap(([key, valueOrValues]) => {
				return preferArray(valueOrValues).map((value) => <input type='hidden' name={key} value={value} key={key} />);
			})}
			<InputWithOverlay
				type='submit'
				value={isUpdate ? 'Update external links in MusicBrainz' : 'Import into MusicBrainz'}
			>
				<SpriteIcon name={isUpdate ? 'database-edit' : 'database-import'} />
			</InputWithOverlay>
		</form>
	);
}
