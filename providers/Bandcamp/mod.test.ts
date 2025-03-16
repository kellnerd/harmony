import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import { assertSnapshot } from '@std/testing/snapshot';

import BandcampProvider from './mod.ts';

describe('Bandcamp provider', () => {
	const bc = new BandcampProvider(makeProviderOptions());
	const lookupStub = stubProviderLookups(bc);

	describeProvider(bc, {
		urls: [{
			description: 'album page',
			url: new URL('https://theuglykings.bandcamp.com/album/darkness-is-my-home'),
			id: { type: 'album', id: 'theuglykings/darkness-is-my-home' },
			isCanonical: true,
		}, {
			description: 'album page with tracking parameter',
			url: new URL('https://hiroshi-yoshimura.bandcamp.com/album/flora?from=discover_page'),
			id: { type: 'album', id: 'hiroshi-yoshimura/flora' },
		}, {
			description: 'standalone track page',
			url: new URL('https://zeug.bandcamp.com/track/yeltsa-kcir'),
			id: { type: 'track', id: 'zeug/yeltsa-kcir' },
			serializedId: 'zeug/track/yeltsa-kcir',
			isCanonical: true,
		}, {
			description: 'artist page/subdomain',
			url: new URL('https://taxikebab.bandcamp.com/'),
			id: { type: 'artist', id: 'taxikebab' },
			isCanonical: true,
		}, {
			description: 'artist /music page',
			url: new URL('https://theuglykings.bandcamp.com/music'),
			id: { type: 'artist', id: 'theuglykings' },
			isCanonical: false,
		}, {
			description: 'URL without subdomain',
			url: new URL('https://bandcamp.com/discover'),
			id: undefined,
		}],
		releaseLookup: [{
			description: 'label release with fixed price (which is not free despite minimum_price of 0.0)',
			release: 'thedarkthursday/and-it-was-a-burned-into-my-mind-yet-i-faltered-like-a-broken-record',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				const isFree = release.externalLinks.some((link) => link.types?.includes('free download'));
				assert(!isFree, 'Release should not be downloadable for free');
				const accountName = 'thedarkthursday';
				assert(
					release.labels?.some((label) => label.externalIds?.some(({ id }) => id === accountName)),
					'Bandcamp account should be linked to a label',
				);
				assert(
					!release.artists?.some((artist) => artist.externalIds?.some(({ id }) => id === accountName)),
					'Bandcamp account should not be linked to an artist',
				);
			},
		}],
	});

	afterAll(() => {
		lookupStub.restore();
	});
});
