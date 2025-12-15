import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import { assertEquals } from 'std/assert/assert_equals.ts';
import OtotoyProvider from './mod.ts';

describe('OTOTOY provider', () => {
	const provider = new OtotoyProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(provider);

	describeProvider(provider, {
		urls: [{
			description: 'package page',
			url: new URL('https://ototoy.jp/_/default/p/3102862'),
			id: { type: 'package', id: '3102862' },
			isCanonical: true,
		}, {
			description: 'artist page',
			url: new URL('https://ototoy.jp/_/default/a/693805'),
			id: { type: 'artist', id: '693805' },
			isCanonical: true,
		}],
		releaseLookup: [{
			description: 'single track release',
			release: '3016055',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const trackCount = release.media.flatMap((medium) => medium.tracklist).length;
				assertEquals(trackCount, 1, 'Release should have 1 track');
			},
		}, {
			description: 'multi-disc release',
			release: '3237840',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				assertEquals(release.media.length, 4, 'Release should have 4 discs');
				assertEquals(release.media[0].tracklist.length, 60, 'Disc 1 should have 60 tracks');
				assertEquals(release.media[1].tracklist.length, 45, 'Disc 2 should have 45 tracks');
				assertEquals(release.media[2].tracklist.length, 50, 'Disc 3 should have 50 tracks');
				assertEquals(release.media[3].tracklist.length, 36, 'Disc 4 should have 36 tracks');
			},
		}, {
			description: 'multiple artists',
			release: '709920',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				const artists = release.artists.flatMap((artist) => artist.name);
				assertEquals(artists.length, 5, 'Should have 5 artists');
				assertEquals(artists, ['sasakure.UK', 'さくらみこ', '白上フブキ', '夏色まつり', '宝鐘マリン']);
			},
		}, {
			description: 'no label',
			release: '3228080',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assert(!release.labels);
			},
		}, {
			description: 'original release date only',
			release: '1822344',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				assertEquals(release.releaseDate, {
					day: 4,
					month: 10,
					year: 2023,
				});
			},
		}, {
			description: 'catalog number',
			release: '1822344',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				assert(release.labels, 'Release should have a label entry');
				const label = release.labels[0];

				assertEquals(label.name, 'YOASOBI');
				assertEquals(label.externalIds, provider.makeExternalIds({ type: 'label', id: '856521' }));
				assertEquals(label.catalogNumber, 'YOASOBI-081');
			},
		}, {
			description: 'per-track artists',
			release: '3286704',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				assertEquals(release.media.length, 1);
				const media = release.media[0];

				assertEquals(media.tracklist.length, 6);
				const trackArtists = [
					['880492'],
					['880492', '1851346'],
					['880492', '807897'],
					['880492', '1851348'],
					['880492', '1329419'],
					['880492', '807897', '1258599'],
				];

				media.tracklist.forEach((track, index) => {
					const expectedArtists = trackArtists[index].flatMap((value) =>
						provider.makeExternalIds({ type: 'artist', id: value })
					);
					assertEquals(track.artists!.flatMap((artist) => artist.externalIds![0]), expectedArtists);
				});
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
