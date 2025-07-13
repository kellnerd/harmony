import type { ErrorConstructor } from '@/utils/errors.ts';
import { dirname } from '@std/path/dirname';
import { stub } from '@std/testing/mock';
import { urlToFilePath } from './file_path.ts';

/** CLI flag (`--download`) which allows {@linkcode stubFetchWithCache} etc. to make network requests. */
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
		const path = await urlToFilePath(url, { baseDir: cacheDir });

		if (downloadMode) {
			const response = await originalFetch(input, init);
			await saveResponse(response.clone(), path);
			return response;
		} else {
			return loadResponse(path);
		}
	});
}

/** Writes the body of the given response to the file at the given path. */
export async function saveResponse(response: Response, path: string): Promise<void> {
	const { body } = response;
	if (response.ok && body) {
		await Deno.mkdir(dirname(path), { recursive: true });
		await Deno.writeFile(path, body);
	}
}

/** Reads the cached response body from the file at the given path. */
export async function loadResponse(path: string, NotFoundError: ErrorConstructor = Error): Promise<Response> {
	try {
		const body = await Deno.readFile(path);
		return new Response(body);
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			throw new NotFoundError(`Response has not been cached at ${path}`);
		} else {
			throw error;
		}
	}
}
