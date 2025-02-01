import { describeProvider, makeProviderOptions } from '@/providers/test_spec.ts';
import { stubFetchWithCache } from '@/utils/stub.ts';
import { describe } from '@std/testing/bdd';

import BandcampProvider from './mod.ts';

// FIXME: `deno test mod.test.ts` fails for Deno 2.1 because of a (.d.mts type import!) dependency of `snap_storage`:
// error: Expected a JavaScript or TypeScript module, but identified a Unknown module. Importing these types of modules is currently not supported.
//   Specifier: https://deno.land/std@0.224.0/crypto/_wasm/lib/deno_std_wasm_crypto.generated.d.mts
//   at https://deno.land/std@0.224.0/crypto/_wasm/lib/deno_std_wasm_crypto.generated.mjs:5:22
// -> https://github.com/denoland/deno/issues/22889
// But `deno check mod.test.ts`, `deno run mod.test.ts` and `deno test --no-check mod.test.ts` run just fine!?

describe('Bandcamp provider', () => {
	using _fetchStub = stubFetchWithCache();
	const bc = new BandcampProvider(makeProviderOptions());

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
			id: { type: 'track', id: 'zeug/track/yeltsa-kcir' },
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
		}],
		releaseLookup: [{
			release: new URL('https://mortimer3.bandcamp.com/album/grey-to-white'),
		}],
	});
});
