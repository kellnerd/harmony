import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { assert } from 'std/assert/assert.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import iTunesProvider from './mod.ts';

describe('iTunes provider', () => {
	const itunes = new iTunesProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(itunes);

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
		releaseLookup: [{
			description: 'multi-disc download with video tracks',
			release: new URL('https://music.apple.com/gb/album/a-night-at-the-opera-deluxe-edition/1441458047'),
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assertEquals(release.media.length, 2, 'Release should have multiple discs');
				assertEquals(release.media[1].tracklist[6].type, 'video', 'Track 2.7 should be a video');
				assert(release.externalLinks[0].types?.includes('paid download'), 'Release should be downloadable');
				assertEquals(release.info.providers[0].lookup.region, 'GB', 'Lookup should use the region from the URL');
			},
		}, {
			description: 'EP lookup ignores standalone music video',
			release: '1728639278',
			assert: (release) => {
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assertEquals(allTracks.length, 6, 'Release should have 6 tracks');
				assert(!allTracks.some((track) => track.type === 'video'), 'No track should be a video');
				assertEquals(release.types, ['EP'], 'EP should be detected from title');
				assertEquals(release.title, 'Nightmare·Escape The ERA', 'Automatic " - EP" title suffix should be dropped');
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
