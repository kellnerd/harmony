import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups, stubTokenRetrieval } from '@/providers/test_stubs.ts';
import { downloadMode } from '@/utils/fetch_stub.ts';
import { assert } from 'std/assert/assert.ts';
import { afterAll, describe } from '@std/testing/bdd';
import type { Stub } from '@std/testing/mock';
import { assertSnapshot } from '@std/testing/snapshot';

import SoundCloudProvider from './mod.ts';

describe('SoundCloud provider', () => {
	const sc = new SoundCloudProvider(makeProviderOptions());
	const stubs: Stub[] = [stubProviderLookups(sc)];

	if (!downloadMode) {
		stubs.push(stubTokenRetrieval(sc));
	}

	describeProvider(sc, {
		urls: [{
			description: 'album page',
			url: new URL('https://soundcloud.com/ivycomb/sets/crimsongalaxies'),
			id: { type: 'set', id: 'ivycomb/crimsongalaxies' },
			isCanonical: true,
		}, {
			description: 'standalone track page',
			url: new URL('https://soundcloud.com/lonealphamusic/magazines'),
			id: { type: 'track', id: 'lonealphamusic/magazines' },
			serializedId: 'lonealphamusic/track/magazines',
			isCanonical: true,
		}, {
			description: 'artist page',
			url: new URL('https://soundcloud.com/vocalokat'),
			id: { type: 'artist', id: 'vocalokat' },
			isCanonical: true,
		}],
		releaseLookup: [{
			description: 'track release with downloads enabled',
			release: 'leagueoflegends/track/piercing-light-mako-remix',
			assert: async (release, ctx) => {
				await assertSnapshot(ctx, release);
				const isFree = release.externalLinks.some((link) => link.types?.includes('free download'));
				assert(isFree, 'Release should be downloadable for free');
			},
		}],
	});

	afterAll(() => {
		stubs.forEach((stub) => stub.restore());
	});
});
