import { stubFetchWithCache } from '@/utils/stub.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { describe } from '@std/testing/bdd';

import DeezerProvider from './mod.ts';

describe('Deezer provider', () => {
	using _fetchStub = stubFetchWithCache();
	const deezer = new DeezerProvider(makeProviderOptions());

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
		}],
	});
});
