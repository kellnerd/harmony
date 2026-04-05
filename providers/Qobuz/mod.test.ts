import '@std/dotenv/load';
import type { ReleaseOptions } from '@/harmonizer/types.ts';
import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import QobuzProvider from './mod.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';

describe('Qobuz provider', () => {
	const qobuz = new QobuzProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(qobuz);

	// Standard options which have an effect for Qobuz.
	const releaseOptions: ReleaseOptions = {
		withISRC: true,
		withAllTrackArtists: true,
	};

	describeProvider(qobuz, {
		urls: [{
			description: 'open.qobuz release page',
			url: new URL('https://open.qobuz.com/album/n288n588k0dza'),
			id: { type: 'album', id: 'n288n588k0dza' },
			isCanonical: true,
		}, {
			description: 'play.qobuz release page',
			url: new URL('https://play.qobuz.com/album/n288n588k0dza'),
			id: { type: 'album', id: 'n288n588k0dza' },
		}, {
			description: 'www.qobuz release page with locale and slug',
			url: new URL('https://www.qobuz.com/fr-fr/album/let-me-battle-9lana/n288n588k0dza'),
			id: { type: 'album', id: 'n288n588k0dza', slug: 'let-me-battle-9lana' },
		}, {
			description: 'open.qobuz artist page',
			url: new URL('https://open.qobuz.com/artist/19452726'),
			id: { type: 'artist', id: '19452726' },
			isCanonical: true,
		}, {
			description: 'www.qobuz artist page with locale and slug',
			url: new URL('https://www.qobuz.com/us-en/interpreter/9lana/19452726'),
			id: { type: 'interpreter', id: '19452726', slug: '9lana' },
		}, {
			description: 'open.qobuz track page',
			url: new URL('https://open.qobuz.com/track/285222652'),
			id: { type: 'track', id: '285222652' },
			isCanonical: true,
		}, {
			description: 'play.qobuz track page',
			url: new URL('https://play.qobuz.com/track/285222652'),
			id: { type: 'track', id: '285222652' },
		}, {
			description: 'label page',
			url: new URL('https://play.qobuz.com/label/97377'),
			id: { type: 'label', id: '97377' },
			isCanonical: true,
		}, {
			description: 'playlist page',
			url: new URL('https://play.qobuz.com/playlist/56730990'),
			id: undefined,
		}],
		invalidIds: [],
		releaseLookup: [{
			description: 'single by two artists',
			release: new URL('https://play.qobuz.com/album/rjrikcvbggy0b'),
			options: releaseOptions,
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				assert(release.artists?.length === 2, 'Release should have two artists');
				const allTracks = release.media.flatMap((medium) => medium.tracklist);
				assert(allTracks.every((track) => track.isrc), 'All tracks should have an ISRC');
			},
		}, {
			description: 'find release by (zero-padded) GTIN',
			release: 198884774947,
			assert: (release) => {
				assertEquals(release.gtin, '0198884774947', 'Qobuz GTIN should be zero-padded');
				assert(
					release.externalLinks.find((link) => link.url.includes('jkfpv4xzc6zyc')),
					'GTIN search did not return the expected release',
				);
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
