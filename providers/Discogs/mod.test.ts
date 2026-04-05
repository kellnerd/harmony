import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { describe } from '@std/testing/bdd';

import DiscogsProvider from './mod.ts';

describe('Discogs provider', () => {
	const discogs = new DiscogsProvider(makeProviderOptions());

	describeProvider(discogs, {
		urls: [{
			description: 'release URL',
			url: new URL('https://www.discogs.com/release/10415130'),
			id: { type: 'release', id: '10415130' },
			isCanonical: true,
		}, {
			description: 'release URL with slug',
			url: new URL('https://www.discogs.com/release/1873013-Pink-Floyd-The-Dark-Side-Of-The-Moon'),
			id: { type: 'release', id: '1873013', slug: 'Pink-Floyd-The-Dark-Side-Of-The-Moon' },
		}, {
			description: 'release URL with locale and slug',
			url: new URL('https://www.discogs.com/de/release/2325157-Frumpy-All-Will-Be-Changed'),
			id: { type: 'release', id: '2325157', slug: 'Frumpy-All-Will-Be-Changed' },
		}, {
			description: 'artist URL',
			url: new URL('https://www.discogs.com/artist/82730'),
			id: { type: 'artist', id: '82730' },
			isCanonical: true,
		}, {
			description: 'artist URL with slug',
			url: new URL('https://www.discogs.com/artist/45467-Pink-Floyd'),
			id: { type: 'artist', id: '45467', slug: 'Pink-Floyd' },
		}, {
			description: 'label URL',
			url: new URL('https://www.discogs.com/label/7704'),
			id: { type: 'label', id: '7704' },
			isCanonical: true,
		}, {
			description: 'label URL with slug',
			url: new URL('https://www.discogs.com/label/26126-EMI'),
			id: { type: 'label', id: '26126', slug: 'EMI' },
		}, {
			description: 'master release URL',
			url: new URL('https://www.discogs.com/master/5863'),
			id: { type: 'master', id: '5863' },
			isCanonical: true,
		}, {
			description: 'master release URL with slug',
			url: new URL('https://www.discogs.com/master/3228-Kraftwerk-Radio-Aktivit%C3%A4t'),
			id: { type: 'master', id: '3228', slug: 'Kraftwerk-Radio-Aktivit%C3%A4t' },
		}, {
			description: 'genre URL',
			url: new URL('https://www.discogs.com/genre/rock'),
			id: undefined,
		}],
		invalidIds: ['text'],
		releaseLookup: [],
	});
});
