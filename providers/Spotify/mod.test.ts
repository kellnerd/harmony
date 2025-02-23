// Automatically load .env environment variable file (before anything else).
import 'std/dotenv/load.ts';

import type { ReleaseOptions } from '@/harmonizer/types.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubTokenRetrieval } from '@/providers/test_stubs.ts';
import { downloadMode, stubFetchWithCache } from '@/utils/stub.ts';
import { describe } from '@std/testing/bdd';

import SpotifyProvider from './mod.ts';

describe('Spotify provider', () => {
	using _fetchStub = stubFetchWithCache();
	const spotify = new SpotifyProvider(makeProviderOptions());

	if (!downloadMode) {
		stubTokenRetrieval(spotify);
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
		}],
		releaseLookup: [
			// { release: '3b4E89rxzZQ9zkhgKpj8N4', options: releaseOptions },
		],
	});
});
