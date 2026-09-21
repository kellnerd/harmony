import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';
import { assertEquals } from 'std/assert/mod.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';

import BeatportProvider from './mod.ts';

describe('Beatport provider', () => {
	const beatport = new BeatportProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(beatport);

	describeProvider(beatport, {
		urls: [{
			description: 'release URL with slug',
			url: new URL('https://www.beatport.com/release/black-mill-tapes-10th-anniversary-box/3176998'),
			id: { type: 'release', id: '3176998', slug: 'black-mill-tapes-10th-anniversary-box' },
			isCanonical: true,
		}, {
			description: 'artist URL with slug',
			url: new URL('https://www.beatport.com/artist/deadmau5/26182'),
			id: { type: 'artist', id: '26182', slug: 'deadmau5' },
			isCanonical: true,
		}, {
			description: 'label URL with slug',
			url: new URL('https://www.beatport.com/label/physical-techno-recordings/41056'),
			id: { type: 'label', id: '41056', slug: 'physical-techno-recordings' },
			isCanonical: true,
		}, {
			description: 'track URL with slug',
			url: new URL('https://www.beatport.com/track/tokyo-night/19209410'),
			id: { type: 'track', id: '19209410', slug: 'tokyo-night' },
			isCanonical: true,
		}],
		invalidIds: ['text'],
		releaseLookup: [{
			description: 'partially explicit release',
			release: new URL('https://www.beatport.com/release/little-grunts/7059114'),
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);

				assertEquals(release.advisoryRating, 'explicit', 'Release should be marked explicit');
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				allTracks.forEach((track, index) => {
					if ([0, 1, 4, 6, 8, 12].includes(index)) {
						assertEquals(track.advisoryRating, 'explicit', 'The third track should be marked explicit');
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
