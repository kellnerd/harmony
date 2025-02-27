import { downloadMode, loadResponse, saveResponse } from '@/utils/fetch_stub.ts';
import { urlToFilePath } from '@/utils/file_path.ts';
import { stub } from '@std/testing/mock';
import type { CacheOptions } from 'snap-storage';
import type { MetadataApiProvider, MetadataProvider } from './base.ts';

/** Prevents the given provider from retrieving an API access token. */
export function stubTokenRetrieval(provider: MetadataApiProvider) {
	return stub(
		provider,
		// @ts-ignore-error -- Private method is not visible in TS, but accessible in JS.
		'cachedAccessToken',
		() => Promise.resolve('dummy token'),
	);
}

/**
 * Stubs {@linkcode MetadataProvider.fetchSnapshot} to load the response from a cache instead of making a network request.
 *
 * Only in {@linkcode downloadMode} the resource will be fetched and written to the cache (as a file).
 */
export function stubProviderLookups(provider: MetadataProvider, cacheDir = 'testdata') {
	return stub(
		provider,
		// @ts-ignore-error -- Private method is not visible in TS, but accessible in JS.
		'fetchSnapshot',
		async function (input: string | URL, options?: CacheOptions) {
			const path = await urlToFilePath(new URL(input), { baseDir: cacheDir });
			let response: Response;

			if (downloadMode) {
				response = await provider.fetch(input, options?.requestInit);
				if (options?.responseMutator) {
					response = await options.responseMutator(response);
				}
				await saveResponse(response.clone(), path);
			} else {
				response = await loadResponse(path);
			}

			return {
				content: response,
				// Dummy data, should not be relevant in this context.
				timestamp: 0,
				isFresh: downloadMode,
				contentHash: '',
				path: '',
			};
		},
	);
}
