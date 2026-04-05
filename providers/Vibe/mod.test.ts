import type { ReleaseOptions } from '@/harmonizer/types.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import VibeProvider from './mod.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';

describe('Naver provider', () => {
	const vibe = new VibeProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(vibe);

	// Standard options which have an effect for Naver VIBE.
	const releaseOptions: ReleaseOptions = {
		withISRC: false,
		withAllTrackArtists: true,
	};

	describeProvider(vibe, {
		urls: [{
			description: 'vibe album page',
			url: new URL('https://vibe.naver.com/album/34923420'),
			id: { type: 'album', id: '34923420' },
			isCanonical: true,
		}, {
			description: 'vibe track page',
			url: new URL('https://vibe.naver.com/track/96143273'),
			id: { type: 'track', id: '96143273' },
		}, {
			description: 'vibe artist page',
			url: new URL('https://vibe.naver.com/artist/8956811'),
			id: { type: 'artist', id: '8956811' },
			isCanonical: true,
		}, {
			description: 'playlist page',
			url: new URL('https://vibe.naver.com/mylist/64211346'),
			id: undefined,
		}],
		invalidIds: ['according to all known laws of aviation...'],
		releaseLookup: [{
			description: 'single with a featuring artist',
			release: new URL('https://vibe.naver.com/album/34923420'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks[0].artists?.length === 2, 'Main track should have two artists');
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
