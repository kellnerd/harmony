import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { describe } from '@std/testing/bdd';

import iTunesProvider from './mod.ts';

describe('iTunes provider', () => {
	const itunes = new iTunesProvider(makeProviderOptions());

	describeProvider(itunes, {
		urls: [{
			description: 'Apple Music album URL',
			url: new URL('https://music.apple.com/de/album/1705742568'),
			id: { type: 'album', id: '1705742568', region: 'DE' },
			isCanonical: true,
		}, {
			description: 'Apple Music album URL with implicit region',
			url: new URL('https://music.apple.com/album/1705742568'),
			id: { type: 'album', id: '1705742568', region: 'US' },
		}, {
			description: 'Apple Music album URL with slug',
			url: new URL('https://music.apple.com/de/album/all-will-be-changed/1705742568'),
			id: { type: 'album', id: '1705742568', region: 'DE', slug: 'all-will-be-changed' },
		}, {
			description: 'Apple Music artist URL',
			url: new URL('https://music.apple.com/gb/artist/136975'),
			id: { type: 'artist', id: '136975', region: 'GB' },
			isCanonical: true,
		}, {
			description: 'Apple Music artist URL with slug',
			url: new URL('https://music.apple.com/gb/artist/the-beatles/136975'),
			id: { type: 'artist', id: '136975', region: 'GB', slug: 'the-beatles' },
		}, {
			description: 'Apple Music artist URL with slug and tracking parameters',
			url: new URL('https://music.apple.com/us/artist/saint-motel/301341347?uo=4'),
			id: { type: 'artist', id: '301341347', region: 'US', slug: 'saint-motel' },
		}, {
			description: 'Apple Music song URL',
			url: new URL('https://music.apple.com/gb/song/1772318408'),
			id: { type: 'song', id: '1772318408', region: 'GB' },
			isCanonical: true,
		}, {
			description: 'Apple Music song URL with slug',
			url: new URL('https://music.apple.com/fr/song/wet-cheese-delirium-2015-remaster/973594909'),
			id: { type: 'song', id: '973594909', region: 'FR', slug: 'wet-cheese-delirium-2015-remaster' },
		}, {
			description: 'iTunes legacy album URL',
			url: new URL('https://itunes.apple.com/gb/album/id1722294645'),
			id: { type: 'album', id: '1722294645', region: 'GB' },
		}, {
			description: 'iTunes legacy album URL with implicit region',
			url: new URL('https://itunes.apple.com/album/id1722294645'),
			id: { type: 'album', id: '1722294645', region: 'US' },
		}, {
			description: 'Apple Music geo. album URL',
			url: new URL('https://geo.music.apple.com/album/1135913516'),
			id: { type: 'album', id: '1135913516', region: 'US' },
		}, {
			description: 'iTunes geo. album URL',
			url: new URL('https://geo.itunes.apple.com/album/id1135913516'),
			id: { type: 'album', id: '1135913516', region: 'US' },
		}],
		releaseLookup: [],
	});
});
