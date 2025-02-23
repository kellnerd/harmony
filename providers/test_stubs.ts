import { stub } from '@std/testing/mock';
import type { MetadataApiProvider } from './base.ts';

/** Prevents the given provider from retrieving an API access token. */
export function stubTokenRetrieval(provider: MetadataApiProvider) {
	return stub(
		provider,
		// deno-lint-ignore no-explicit-any -- Private method is not visible in TS, but accessible in JS.
		'cachedAccessToken' as any,
		() => Promise.resolve('dummy token'),
	);
}
