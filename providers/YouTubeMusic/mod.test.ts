import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubProviderLookups } from '@/providers/test_stubs.ts';
import { afterAll, describe } from '@std/testing/bdd';

import YouTubeMusicProvider from './mod.ts';

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
		releaseLookup: [],
	});

	afterAll(() => {
		stub.restore();
	});
});
