import { describeProvider } from '@/providers/test_spec.ts';
import { describe } from 'std/testing/bdd.ts';

import BandcampProvider from './mod.ts';

// FIXME: `deno test mod.test.ts` fails for Deno 2.1 because of a (.d.mts type import!) dependency of `snap_storage`:
// error: Expected a JavaScript or TypeScript module, but identified a Unknown module. Importing these types of modules is currently not supported.
//   Specifier: https://deno.land/std@0.224.0/crypto/_wasm/lib/deno_std_wasm_crypto.generated.d.mts
//   at https://deno.land/std@0.224.0/crypto/_wasm/lib/deno_std_wasm_crypto.generated.mjs:5:22
// -> https://github.com/denoland/deno/issues/22889
// But `deno check mod.test.ts`, `deno run mod.test.ts` and `deno test --no-check mod.test.ts` run just fine!?

describe('Bandcamp provider', () => {
	const bc = new BandcampProvider();

	describeProvider(bc, {
		urls: [{
			description: 'artist subdomains',
			url: new URL('https://example.bandcamp.com'),
			id: { type: 'artist', id: 'example' },
			isCanonical: true,
		}, {
			description: 'artist /music pages',
			url: new URL('https://example.bandcamp.com/music'),
			id: { type: 'artist', id: 'example' },
			isCanonical: false,
		}, {
			description: 'URLs without subdomain',
			url: new URL('https://bandcamp.com/discover'),
		}],
	});
});
