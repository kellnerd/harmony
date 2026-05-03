import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { assert } from 'std/assert/assert.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import DiscogsProvider from './mod.ts';

describe('Discogs provider', () => {
	const discogs = new DiscogsProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(discogs);

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
			description: 'release URL with locale, slug and tracking parameter',
			url: new URL('https://www.discogs.com/de/release/2325157-Frumpy-All-Will-Be-Changed?redirected=true'),
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
		releaseLookup: [{
			description: 'VA soundtrack CD without release date',
			release: new URL(
				'https://www.discogs.com/release/16004480-Various-Stanley-Kubricks-A-Clockwork-Orange-Music-From-The-Soundtrack',
			),
			async assert(release, context) {
				await assertSnapshot(context, release);
				assertEquals(release.releaseDate, undefined);
				assertEquals(release.media.length, 1);
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assertEquals(allTracks.length, 15);
				assert(allTracks.every((track) => track.artists), 'All tracks should have artist credits');
			},
		}, {
			description: 'double vinyl LP with medium titles and sub-tracks',
			release: new URL('https://www.discogs.com/release/8604223-Pink-Floyd-Ummagumma'),
			async assert(release, context) {
				await assertSnapshot(context, release);
				const mediumTitles = release.media.map((medium) => medium.title);
				assertEquals(mediumTitles, ['Live Album', 'Studio Album']);
				const trackNumbers = release.media.map((medium) => medium.tracklist.map((track) => track.number));
				assertEquals(trackNumbers, [['A1', 'A2', 'B1', 'B2'], ['C1', 'C2', 'C3', 'D1', 'D2']]);
			},
		}, {
			description: 'obligatory maxi-single with multiple release countries',
			release: new URL('https://www.discogs.com/release/1503102'),
			assert(release) {
				assertEquals(release.types, ['Single']);
				assertEquals(release.availableIn, ['AU', 'NZ']);
				const trackNumbers = release.media.map((medium) => medium.tracklist.map((track) => track.number));
				assertEquals(trackNumbers, [['A', 'B1', 'B2']]);
			},
		}, {
			description: 'audiobook with section titles that span across multiple CDs',
			release: new URL('http://www.discogs.com/release/11578434-Enid-Blyton-Read-By-Kate-Winslet-Blytons-Faraway-Tree'),
			async assert(release, context) {
				await assertSnapshot(context, release.artists, 'Artist credit should include author and narrator');
				assertEquals(release.availableIn, undefined);
				assertEquals(release.labels?.[0].catalogNumber, '[none]');
				const mediumLayout = release.media.map((medium) => ({
					medium: medium.number,
					title: medium.title,
					trackCount: medium.tracklist.length,
				}));
				await assertSnapshot(context, mediumLayout, 'Groups of CDs should share the same title');
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks.every((track) => track.title === 'Untitled'));
				const onlyDigits = /^\d+$/;
				assert(
					allTracks.every((track) => typeof track.number === 'string' && onlyDigits.test(track.number)),
					'Medium prefixes should have been removed from track numbers',
				);
			},
		}, {
			description: 'huge box set with named mediums, named sections and index tracks used as sections',
			release: new URL('https://www.discogs.com/release/9218307-Pink-Floyd-The-Early-Years-1965-1972'),
			async assert(release, context) {
				assertEquals(release.media.length, 33);
				assertEquals(release.packaging, 'Box');
				assertEquals(release.types, ['Compilation']);
				const boxMediumLayout = release.media.map((medium) => ({
					medium: medium.number,
					format: medium.format,
					title: medium.title,
					trackCount: medium.tracklist.length,
				}));
				await assertSnapshot(context, boxMediumLayout);
				assertEquals(
					release.media[1].tracklist[0].title,
					'Live in Stockholm 1967: Introduction',
					'Prefix should be followed by a single semicolon',
				);
				assertEquals(release.media[5].tracklist[26].title, 'Credits', 'Title should have no "-" section prefix');
				assertEquals(release.media[10].tracklist[1].number, '1a', 'Non-standard track number should be preserved');
				assertEquals(
					release.media[21].tracklist[2].title,
					'Brighton Dome, UK, 29 June 1972: Set The Controls For The Heart Of The Sun',
					'"Sub"-track title should be prefixed by index track title',
				);
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
