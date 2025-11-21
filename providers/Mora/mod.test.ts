import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import MoraProvider from './mod.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';

describe('Mora provider', () => {
	const bc = new MoraProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(bc);

	describeProvider(bc, {
		urls: [{
			description: 'album page',
			url: new URL('https://mora.jp/package/43000006/00602488058599/'),
			id: { type: 'album', id: '43000006/00602488058599' },
			isCanonical: true,
		}, {
			description: 'album page with tracking parameter',
			url: new URL('https://mora.jp/package/43000087/SEXX03051B00Z/?fmid=TOPRNKS'),
			id: { type: 'album', id: '43000087/SEXX03051B00Z' },
		}, {
			description: 'artist page',
			url: new URL('https://mora.jp/artist/1739884/'),
			id: { type: 'artist', id: '1739884' },
			isCanonical: true,
		}],
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
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
