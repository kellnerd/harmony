import type { ReleaseOptions } from '@/harmonizer/types.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubFetchWithCache } from '@/utils/stub.ts';
import { assert } from 'std/assert/assert.ts';
import { describe } from '@std/testing/bdd';

import DeezerProvider from './mod.ts';

describe('Deezer provider', () => {
	stubFetchWithCache();
	const deezer = new DeezerProvider(makeProviderOptions());

	// Standard options which have an effect for Deezer.
	const releaseOptions: ReleaseOptions = {
		withSeparateMedia: true,
		withAllTrackArtists: true,
		withISRC: true,
	};

	describeProvider(deezer, {
		urls: [{
			description: 'release page',
			url: new URL('https://www.deezer.com/album/11591214'),
			id: { type: 'album', id: '11591214' },
			isCanonical: true,
		}, {
			description: 'localized release page',
			url: new URL('https://www.deezer.com/fr/album/629506181'),
			id: { type: 'album', id: '629506181' },
		}, {
			description: 'localized release page without www subdomain',
			url: new URL('https://deezer.com/en/album/521038732'),
			id: { type: 'album', id: '521038732' },
		}, {
			description: 'artist page',
			url: new URL('https://www.deezer.com/artist/8686'),
			id: { type: 'artist', id: '8686' },
			isCanonical: true,
		}, {
			description: 'playlist page',
			url: new URL('https://www.deezer.com/en/playlist/1976454162'),
		}],
		releaseLookup: [{
			description: 'single by two artists',
			release: new URL('https://www.deezer.com/en/album/629506181'),
			options: releaseOptions,
			assert: (release) => {
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks[0].artists?.length === 2, 'Main track should have two artists');
				assert(allTracks.every((track) => track.isrc), 'All tracks should have an ISRC');
			},
		}, {
			description: 'single by two artists (without additional lookup options)',
			release: '629506181', // same single as the previous one
			skipSnapshot: true, // just a subset of the previous one
			assert: (release) => {
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks.every((track) => track.artists?.length === 1), 'Tracks should not have multiple artists');
				assert(allTracks.every((track) => !track.isrc), 'Tracks should not have an ISRC');
			},
		}],
	});
});
