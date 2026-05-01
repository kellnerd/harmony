import type { ReleaseOptions } from '@/harmonizer/types.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups, stubTokenRetrieval } from '@/providers/test_stubs.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';
import { assert, assertEquals } from 'std/assert/mod.ts';

import BugsProvider from './mod.ts';

describe('Bugs! provider', () => {
	const bugs = new BugsProvider(makeProviderOptions());
	const stubs = [stubProviderLookups(bugs), stubTokenRetrieval(bugs)];

	const releaseOptions: ReleaseOptions = {
		withISRC: false,
		withAllTrackArtists: true,
	};

	describeProvider(bugs, {
		urls: [{
			description: 'album page',
			url: new URL('https://music.bugs.co.kr/album/4119156'),
			id: { type: 'album', id: '4119156' },
			isCanonical: true,
		}, {
			description: 'artist page',
			url: new URL('https://music.bugs.co.kr/artist/20171256'),
			id: { type: 'artist', id: '20171256' },
		}, {
			description: 'track page',
			url: new URL('https://music.bugs.co.kr/track/6180357'),
			id: { type: 'track', id: '6180357' },
		}, {
			description: 'search page (unsupported)',
			url: new URL('https://music.bugs.co.kr/search/track?q=test'),
			id: undefined,
		}],
		invalidIds: ['abc', 'not-a-number', '123abc'],
		releaseLookup: [{
			description: 'Regular (정규) album',
			release: new URL('https://music.bugs.co.kr/album/4119156'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 10, 'Should have 10 tracks');
				assert(release.types?.includes('Album'), 'Should be classified as Album');
			},
		}, {
			description: 'Regular (정규) album with multiple discs and multiple artists',
			release: new URL('https://music.bugs.co.kr/album/590752'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 2, 'Should have two discs');
				assertEquals(release.media[0].tracklist.length, 10, 'Disc 1 should have 10 tracks');
				assertEquals(release.media[1].tracklist.length, 7, 'Disc 2 should have 7 tracks');
				assert(release.types?.includes('Album'), 'Should be classified as Album');
				const lastTrack = release.media[1].tracklist.at(-1)!;
				assertEquals(
					lastTrack.artists?.map((a) => a.name),
					['웨이(크레용팝)', '초아(크레용팝)'],
					'Track with multiple artists should have correct artists',
				);
			},
		}, {
			description: 'EP (미니) album',
			release: new URL('https://music.bugs.co.kr/album/4078166'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 5, 'Should have 5 tracks');
				assert(release.types?.includes('EP'), 'Should be classified as EP');
			},
		}, {
			description: 'Single (싱글) album',
			release: new URL('https://music.bugs.co.kr/album/4111423'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 1, 'Should have 1 track');
				assert(release.types?.includes('Single'), 'Should be classified as Single');
			},
		}, {
			description: 'Compilation/Best of (베스트) album with an unavailable, CD-only bonus track',
			release: new URL('https://music.bugs.co.kr/album/4134802'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 23, 'Should have 23 tracks (without the CD-only track)');
				assert(release.types?.includes('Compilation'), 'Should be classified as Compilation');
			},
		}],
	});

	afterAll(() => {
		stubs.forEach((s) => s.restore());
	});
});
