import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups, stubTokenRetrieval } from '@/providers/test_stubs.ts';
import { afterAll, describe } from '@std/testing/bdd';

import AppleMusicProvider from './mod.ts';

describe('Apple Music provider', () => {
	const appleMusic = new AppleMusicProvider(makeProviderOptions());
	const stubs = [stubProviderLookups(appleMusic), stubTokenRetrieval(appleMusic)];

	describeProvider(appleMusic, {
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
			description: 'Apple Music song URL',
			url: new URL('https://music.apple.com/gb/song/1772318408'),
			id: { type: 'song', id: '1772318408', region: 'GB' },
			isCanonical: true,
		}, {
			description: 'Apple Music video URL',
			url: new URL('https://music.apple.com/gb/music-video/1441458100'),
			id: { type: 'music-video', id: '1441458100', region: 'GB' },
			isCanonical: true,
		}, {
			description: 'Apple Music geo. album URL',
			url: new URL('https://geo.music.apple.com/album/1135913516'),
			id: { type: 'album', id: '1135913516', region: 'US' },
		}, {
			description: 'iTunes album URL (handled by iTunes provider)',
			url: new URL('https://itunes.apple.com/gb/album/id1722294645'),
			id: undefined,
		}],
		invalidIds: ['text'],
		releaseLookup: [],
	});

	afterAll(() => {
		stubs.forEach((stub) => stub.restore());
	});
});
