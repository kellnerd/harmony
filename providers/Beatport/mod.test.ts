import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { describe } from '@std/testing/bdd';

import BeatportProvider from './mod.ts';

describe('Beatport provider', () => {
	const beatport = new BeatportProvider(makeProviderOptions());

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
		}],
		releaseLookup: [],
	});
});
