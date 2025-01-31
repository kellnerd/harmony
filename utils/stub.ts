import { sanitizeFilename } from './sanitize.ts';
import { dirname } from 'std/path/dirname.ts';
import { join } from 'std/path/join.ts';
import { stub } from '@std/testing/mock';

/**
 * Stubs {@linkcode fetch} to load the response from a cache instead of making a network request.
 *
 * Only in download mode (`--download`) the resource will be fetched and written to the cache (as a file).
 */
export function stubFetchWithCache(cacheDir = 'testdata') {
	const originalFetch = globalThis.fetch;
	const downloadMode = Deno.args.includes('--download');

	return stub(globalThis, 'fetch', async function (input, init) {
		const url = new URL(input instanceof Request ? input.url : input);
		const pathSegments = url.href.split('/').map((segment) => sanitizeFilename(segment, '!'));
		const path = join(cacheDir, ...pathSegments);

		if (downloadMode) {
			const response = await originalFetch(input, init);
			const { body } = response.clone();
			if (response.ok && body) {
				await Deno.mkdir(dirname(path), { recursive: true });
				await Deno.writeFile(path, body);
			}
			return response;
		} else {
			try {
				const body = await Deno.readFile(path);
				return new Response(body);
			} catch (error) {
				if (error instanceof Deno.errors.NotFound) {
					throw new Error(`Response for ${url} has not been cached`);
				} else {
					throw error;
				}
			}
		}
	});
}
