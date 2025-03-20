// Automatically load .env environment variable file (before anything else).
import 'std/dotenv/load.ts';

import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups, stubTokenRetrieval } from '@/providers/test_stubs.ts';
import { downloadMode } from '@/utils/fetch_stub.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import type { Stub } from '@std/testing/mock';
import { assertSnapshot } from '@std/testing/snapshot';

import TidalProvider from './mod.ts';

describe('Tidal provider', () => {
	const tidal = new TidalProvider(makeProviderOptions());
	const stubs: Stub[] = [stubProviderLookups(tidal)];

	if (!downloadMode) {
		stubs.push(stubTokenRetrieval(tidal));
	}

	describeProvider(tidal, {
		urls: [{
			description: 'release page',
			url: new URL('https://tidal.com/album/357676034'),
			id: { type: 'album', id: '357676034' },
			isCanonical: true,
		}, {
			description: 'release /browse page',
			url: new URL('https://tidal.com/browse/album/130201923'),
			id: { type: 'album', id: '130201923' },
		}, {
			description: 'listen.tidal.com release page',
			url: new URL('https://listen.tidal.com/album/11343637'),
			id: { type: 'album', id: '11343637' },
		}, {
			description: 'release page with /track suffix',
			url: new URL('https://listen.tidal.com/album/301366648/track/301366649'),
			id: { type: 'album', id: '301366648' },
		}, {
			description: 'artist page',
			url: new URL('https://tidal.com/artist/80'),
			id: { type: 'artist', id: '80' },
			isCanonical: true,
		}, {
			description: 'artist /browse page',
			url: new URL('https://tidal.com/browse/artist/3557299'),
			id: { type: 'artist', id: '3557299' },
		}, {
			description: 'listen.tidal.com artist page',
			url: new URL('https://listen.tidal.com/artist/116'),
			id: { type: 'artist', id: '116' },
		}, {
			description: 'track page',
			url: new URL('https://tidal.com/browse/track/11343638'),
			id: undefined,
		}],
		releaseLookup: [{
			description: 'live album with video tracks and featured artist (v1 API)',
			release: new URL('https://tidal.com/album/130201923'),
			options: {
				// Use data from an old snapshot which was made when the v1 API was still live.
				snapshotMaxTimestamp: 1717684821,
				regions: new Set(['GB']),
			},
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks[5].artists?.length === 2, 'Track 6 should have two artists');
				assert(allTracks[8].type === 'video', 'Track 9 should be a video');
				assert(allTracks.every((track) => track.isrc), 'All tracks should have an ISRC');
			},
		}],
	});

	afterAll(() => {
		stubs.forEach((stub) => stub.restore());
	});
});
