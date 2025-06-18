import { DISTRO_KID_PATTERN } from '@/harmonizer/release_label.ts';
import { cleanupBogusReleaseLabels } from '@/harmonizer/release_label.ts';
import type { Label } from '@/harmonizer/types.ts';
import { noLabel } from '@/musicbrainz/special_entities.ts';
import { describe, it } from '@std/testing/bdd';
import { assert } from 'std/assert/assert.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';

describe('cleanupBogusReleaseLabels', () => {
	it('replaces DistroKid with [no label]', () => {
		const label: Label = {
			name: 'DistroKid',
			catalogNumber: '12345',
			externalIds: [],
		};
		cleanupBogusReleaseLabels([label]);
		assertEquals(label, {
			...noLabel,
			catalogNumber: '12345',
		});
	});

	const distroKidPlaceholders = [
		'Distro Kid', // Tidal
		'123456 Records DK',
		'1234567 Records DK',
		'1234567 Records DK2',
	];

	for (const label of distroKidPlaceholders) {
		it(`detects "${label}" as DistroKid placeholder`, () => {
			assert(DISTRO_KID_PATTERN.test(label));
		});
	}
});
