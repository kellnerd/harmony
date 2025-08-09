import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { afterAll, describe } from '@std/testing/bdd';

import YouTubeMusicProvider from './mod.ts';
import { assertStrictEquals } from 'std/assert/assert_strict_equals.ts';
import type { ArtistCreditName } from '../../harmonizer/types.ts';

describe('YouTube Music provider', () => {
	const youtubeMusic = new YouTubeMusicProvider(makeProviderOptions());
	const stub = stubProviderLookups(youtubeMusic);

	describeProvider(youtubeMusic, {
		urls: [
			{
				description: 'channel page',
				url: new URL('https://music.youtube.com/channel/UCxgN32UVVztKAQd2HkXzBtw'),
				id: { type: 'channel', id: 'UCxgN32UVVztKAQd2HkXzBtw' },
				isCanonical: true,
			},
			{
				description: 'playlist page',
				url: new URL('https://music.youtube.com/playlist?list=OLAK5uy_ncbxWnjKunOOgJ7N1XELrneNgiaMMPXxA'),
				id: { type: 'playlist', id: 'OLAK5uy_ncbxWnjKunOOgJ7N1XELrneNgiaMMPXxA' },
				isCanonical: true,
				serializedId: 'OLAK5uy_ncbxWnjKunOOgJ7N1XELrneNgiaMMPXxA',
			},
			{
				description: 'playlist page with additional query parameters',
				url: new URL(
					'https://music.youtube.com/playlist?list=OLAK5uy_ncbxWnjKunOOgJ7N1XELrneNgiaMMPXxA&feature=shared',
				),
				id: { type: 'playlist', id: 'OLAK5uy_ncbxWnjKunOOgJ7N1XELrneNgiaMMPXxA' },
				serializedId: 'OLAK5uy_ncbxWnjKunOOgJ7N1XELrneNgiaMMPXxA',
			},
			{
				description: 'album (browse) page',
				url: new URL('https://music.youtube.com/browse/MPREb_q16Gzaa1WK8'),
				id: { type: 'browse', id: 'MPREb_q16Gzaa1WK8' },
				isCanonical: true,
				serializedId: 'MPREb_q16Gzaa1WK8',
			},
			{
				description: 'track page',
				url: new URL('https://music.youtube.com/watch?v=-C_rvt0SwLE'),
				id: { type: 'watch', id: '-C_rvt0SwLE' },
				isCanonical: true,
			},
		],
		releaseLookup: [
			{
				description: 'Lookup by playlist URL',
				release: new URL('https://music.youtube.com/playlist?list=OLAK5uy_nMjlCmokT89b9UhrFkht6X-2cWdS4nYNo'),
				assert: (release) => {
					assertStrictEquals(release.media.length, 1);
					const medium = release.media[0];
					assertStrictEquals(medium.tracklist.length, 28);

					const assertArtist = (artistCredits: ArtistCreditName[] | undefined) => {
						assertStrictEquals(artistCredits?.length, 1);
						assertStrictEquals(artistCredits[0].externalIds?.at(0)?.id, 'UCC2AOoHt1RS4Xk0JexgeJZA');
					};
					assertArtist(release.artists);
					medium.tracklist.every((track) => assertArtist(track.artists));
				},
			},
			{
				description: 'Lookup by browse URL',
				release: new URL('https://music.youtube.com/browse/MPREb_WvqEoZqND4g'),
				assert: (release) => {
					assertStrictEquals(release.media.at(0)?.tracklist.length, 1);
				},
			},
			{
				description: 'GTIN lookup with multiple results',
				release: 60270082120,
				assert: (release) => {
					// Release as associated alternate version.
					// Searching for either releases GTIN (60270082120 and 634164416317)
					// incorrectly returns the version with GTIN 60270082120
					//
					// Because of this, the provider gives a warning message stating that YouTube returned multiple releases
					assertStrictEquals(release.info.messages.filter((message) => message.type === 'warning').length, 1);
				},
			},
		],
	});

	afterAll(() => {
		stub.restore();
	});
});
