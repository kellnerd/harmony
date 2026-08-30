import type { ReleaseOptions } from '@/harmonizer/types.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';
import { assertArrayIncludes, assertEquals, assertExists } from 'std/assert/mod.ts';

import GenieProvider from './mod.ts';

describe('Genie provider', () => {
	const genie = new GenieProvider(makeProviderOptions());
	const stubs = [stubProviderLookups(genie)];

	const releaseOptions: ReleaseOptions = {
		withISRC: false,
		withAllTrackArtists: true,
	};

	describeProvider(genie, {
		urls: [{
			description: 'album page',
			url: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=85875094'),
			id: { type: 'album', id: '85875094' },
			isCanonical: true,
		}, {
			description: 'album page without www subdomain',
			url: new URL('https://genie.co.kr/detail/albumInfo?axnm=85875094'),
			id: { type: 'album', id: '85875094' },
		}, {
			description: 'album page with additional query parameters',
			url: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=85875094&ref=share'),
			id: { type: 'album', id: '85875094' },
		}, {
			description: 'mobile album page',
			url: new URL('https://mw.genie.co.kr/detail/albumInfo?axnm=85875094'),
			id: { type: 'album', id: '85875094' },
		}, {
			description: 'song page',
			url: new URL('https://www.genie.co.kr/detail/songInfo?xgnm=108694326'),
			id: { type: 'song', id: '108694326' },
			isCanonical: true,
		}, {
			description: 'artist page',
			url: new URL('https://www.genie.co.kr/detail/artistInfo?xxnm=80740728'),
			id: { type: 'artist', id: '80740728' },
			isCanonical: true,
		}, {
			description: 'album page with mismatched ID parameter (unsupported)',
			url: new URL('https://www.genie.co.kr/detail/albumInfo?xgnm=85875094'),
			id: undefined,
		}, {
			description: 'search page (unsupported)',
			url: new URL('https://www.genie.co.kr/search/searchMain?query=test'),
			id: undefined,
		}],
		invalidIds: ['abc', 'not-a-number', '123abc'],
		releaseLookup: [{
			description: 'Single/EP (싱글/EP) album',
			release: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=81020130'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 5, 'Should have 5 tracks');
				assertExists(release.types, 'Should have release types');
				assertEquals(release.types, ['Single', 'EP'], 'Should be classified as ambiguous Single/EP');
				assertExists(release.labels, 'Should have labels');
				assertEquals(release.labels.map((l) => l.name), ['WM Entertainment'], 'Should use the album planner as label');
			},
		}, {
			description: 'Regular (정규앨범) album',
			release: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=87060653'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 9, 'Should have 9 tracks');
				assertExists(release.types, 'Should have release types');
				assertArrayIncludes(release.types, ['Album'], 'Should be classified as Album');
			},
		}, {
			description: 'OST (기타앨범)',
			release: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=81318832'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 2, 'Should have 2 tracks');
				assertEquals(release.types, undefined, 'Other albums (기타앨범) should not be typed');
				assertExists(release.labels, 'Should have labels');
				assertEquals(release.labels.map((l) => l.name), ['스튜디오S'], 'Label should be trimmed');
			},
		}, {
			description: 'Compilation (베스트/컬렉션) album',
			release: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=82590151'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 19, 'Should have 19 tracks');
				assertExists(release.types, 'Should have release types');
				assertArrayIncludes(release.types, ['Compilation'], 'Should be classified as Compilation');
			},
		}, {
			description: 'Compilation (컴필레이션) with an unavailable CD-only track',
			release: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=87003645'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 1, 'Should have one disc');
				assertEquals(release.media[0].tracklist.length, 23, 'Should have 23 tracks (without the CD-only track)');
				assertExists(release.types, 'Should have release types');
				assertArrayIncludes(release.types, ['Compilation'], 'Should be classified as Compilation');
			},
		}, {
			description: 'Album with two discs of different lengths',
			release: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=80874223'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 2, 'Should have two discs');
				assertEquals(release.media[0].tracklist.length, 10, 'Disc 1 should have 10 tracks');
				assertEquals(release.media[1].tracklist.length, 7, 'Disc 2 should have 7 tracks');
			},
		}, {
			description: 'Album with three discs',
			release: new URL('https://www.genie.co.kr/detail/albumInfo?axnm=81103448'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 3, 'Should have three discs');
				for (const [index, medium] of release.media.entries()) {
					assertEquals(medium.tracklist.length, 11, `Disc ${index + 1} should have 11 tracks`);
				}
			},
		}],
	});

	afterAll(() => {
		stubs.forEach((s) => s.restore());
	});
});
