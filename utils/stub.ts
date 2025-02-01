import { sanitizeFilename } from './sanitize.ts';
import { dirname } from '@std/path/dirname';
import { join } from '@std/path/join';
import { stub } from '@std/testing/mock';

/** CLI flag (`--download`) which allows {@linkcode stubFetchWithCache} to make network requests. */
export const downloadMode = Deno.args.includes('--download');

/**
 * Stubs {@linkcode fetch} to load the response from a cache instead of making a network request.
 *
 * Only in {@linkcode downloadMode} the resource will be fetched and written to the cache (as a file).
 */
export function stubFetchWithCache(cacheDir = 'testdata') {
	const originalFetch = globalThis.fetch;

	return stub(globalThis, 'fetch', async function (input, init) {
		const url = new URL(input instanceof Request ? input.url : input);
		const pathSegments = url.href.split('/').map((segment) => sanitizeFilename(decodeURIComponent(segment), '!'));
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
