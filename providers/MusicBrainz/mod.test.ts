import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { describe } from '@std/testing/bdd';

import MusicBrainzProvider from './mod.ts';

describe('MusicBrainz provider', () => {
	const mb = new MusicBrainzProvider(makeProviderOptions());

	describeProvider(mb, {
		urls: [{
			description: 'release URL',
			url: new URL('https://musicbrainz.org/release/62bf0c5b-b0f6-46b5-a2e5-6f5efd270aab'),
			id: { type: 'release', id: '62bf0c5b-b0f6-46b5-a2e5-6f5efd270aab' },
			isCanonical: true,
		}],
		invalidIds: ['text', '123'],
		releaseLookup: [],
	});
});
