// Automatically load .env environment variable file (before anything else).
import '@std/dotenv/load';

import type { ReleaseOptions } from '@/harmonizer/types.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups, stubTokenRetrieval } from '@/providers/test_stubs.ts';
import { downloadMode } from '@/utils/fetch_stub.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import type { Stub } from '@std/testing/mock';
import { assertSnapshot } from '@std/testing/snapshot';

import SpotifyProvider from './mod.ts';

describe('Spotify provider', () => {
	const spotify = new SpotifyProvider(makeProviderOptions());
	const stubs: Stub[] = [stubProviderLookups(spotify)];

	if (!downloadMode) {
		stubs.push(stubTokenRetrieval(spotify));
	}

	// Standard options which have an effect for Spotify.
	const releaseOptions: ReleaseOptions = {
		withISRC: true,
	};

	describeProvider(spotify, {
		urls: [{
			description: 'release page',
			url: new URL('https://open.spotify.com/album/2ZYLme9VXn1Eo8JDtfN7Y9'),
			id: { type: 'album', id: '2ZYLme9VXn1Eo8JDtfN7Y9' },
			isCanonical: true,
		}, {
			description: 'localized release page',
			url: new URL('https://open.spotify.com/intl-de/album/0m8KmmObidPRHOP5knBkam'),
			id: { type: 'album', id: '0m8KmmObidPRHOP5knBkam' },
		}, {
			description: 'artist page',
			url: new URL('https://open.spotify.com/artist/2lD1D6eEh7xQdBtnl2Ik7Y'),
			id: { type: 'artist', id: '2lD1D6eEh7xQdBtnl2Ik7Y' },
			isCanonical: true,
		}, {
			description: 'artist page with tracking parameter',
			url: new URL('https://open.spotify.com/artist/163tK9Wjr9P9DmM0AVK7lm?si=dcd20f1a6b8b49a3'),
			id: { type: 'artist', id: '163tK9Wjr9P9DmM0AVK7lm' },
		}, {
			description: 'track page',
			url: new URL('https://open.spotify.com/track/1EDPVGbyPKJPeGqATwXZvN'),
			id: { type: 'track', id: '1EDPVGbyPKJPeGqATwXZvN' },
			isCanonical: true,
		}],
		releaseLookup: [{
			description: 'single by two artists',
			release: new URL('https://open.spotify.com/album/10FLjwfpbxLmW8c25Xyc2N'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks[0].artists?.length === 2, 'Main track should have two artists');
				assert(allTracks.every((track) => track.isrc), 'All tracks should have an ISRC');
			},
		}, {
			description: 'single by two artists (without additional lookup options)',
			release: '10FLjwfpbxLmW8c25Xyc2N', // same single as in the previous test
			assert: (release) => {
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks[0].artists?.length === 2, 'Main track should have two artists');
				assert(allTracks.every((track) => !track.isrc), 'Tracks should not have an ISRC');
			},
		}],
	});

	afterAll(() => {
		stubs.forEach((stub) => stub.restore());
	});
});
