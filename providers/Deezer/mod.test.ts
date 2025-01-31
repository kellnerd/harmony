import { stubFetchWithCache } from '@/utils/stub.ts';
import { describeProvider } from '@/providers/test_spec.ts';
import { describe } from '@std/testing/bdd';

import DeezerProvider from './mod.ts';

describe('Deezer provider', () => {
	using _fetchStub = stubFetchWithCache();
	const deezer = new DeezerProvider({
		rateLimitInterval: null, // TODO: only if fetch is stubbed!
	});

	describeProvider(deezer, {
		urls: [{
			description: 'localized release page',
			url: new URL('https://www.deezer.com/en/album/629506181'),
			id: { type: 'album', id: '629506181' },
		}, {
			description: 'playlist page',
			url: new URL('https://www.deezer.com/en/playlist/1976454162'),
		}],
		releaseLookup: [{
			description: 'single by two artists',
			release: new URL('https://www.deezer.com/en/album/629506181'),
		}],
	});
});
