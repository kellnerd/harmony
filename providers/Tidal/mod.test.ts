// Automatically load .env environment variable file (before anything else).
import 'std/dotenv/load.ts';

import { describeProvider } from '@/providers/test_spec.ts';
import { describe } from '@std/testing/bdd';

import TidalProvider from './mod.ts';

describe('Tidal provider', () => {
	const tidal = new TidalProvider();

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
		}],
		releaseLookup: [],
	});
});
