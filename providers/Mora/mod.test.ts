import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import MoraProvider from './mod.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';

describe('Mora provider', () => {
	const mora = new MoraProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(mora);

	describeProvider(mora, {
		urls: [{
			description: 'package page',
			url: new URL('https://mora.jp/package/43000006/00602488058599/'),
			id: { type: 'package', id: '43000006/00602488058599' },
			isCanonical: true,
		}, {
			description: 'package page with tracking parameter',
			url: new URL('https://mora.jp/package/43000087/SEXX03051B00Z/?fmid=TOPRNKS'),
			id: { type: 'package', id: '43000087/SEXX03051B00Z' },
		}, {
			description: 'artist page',
			url: new URL('https://mora.jp/artist/1739884/'),
			id: { type: 'artist', id: '1739884' },
			isCanonical: true,
		}],
		invalidIds: ['text'],
		releaseLookup: [{
			description: 'release with GTIN in distPartNo',
			release: '43000006/00602488058599',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.gtin, '00602488058599');
			},
		}, {
			description: 'release with GTIN in cdPartNo',
			release: '43000035/198704758065_F',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.gtin, '198704758065');
			},
		}, {
			description: 'video release',
			release: '43000006/00199957093194',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const trackCount = release.media.flatMap((medium) => medium.tracklist).length;
				assertEquals(trackCount, 1, 'Release should have 1 track');
				assertEquals(release.media[0].tracklist[0].type, 'video');
			},
		}, {
			description: 'explicit release',
			release: '43000006/00881061522348',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				assertEquals(release.advisoryRating, 'explicit', 'Release should be marked explicit');
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				allTracks.forEach((track, index) => {
					if ([8, 16, 22].includes(index)) {
						assertEquals(track.advisoryRating, 'explicit', `Track ${index + 1} should be marked explicit`);
					} else {
						assertEquals(track.advisoryRating, undefined, `Track ${index + 1} should have no advisory rating`);
					}
				});
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
