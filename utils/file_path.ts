import { join } from 'std/path/join.ts';

/**
 * Replaces all illegal characters inside the given name to form a valid filename (UNIX and Windows).
 * @param basename - Basename of the file.
 * @param replacement - Replacement for all remaining illegal characters, defaults to an underscore.
 */
export function sanitizeFilename(basename: string, replacement = '_') {
	// https://learn.microsoft.com/en-gb/windows/win32/fileio/naming-a-file#naming-conventions
	// deno-lint-ignore no-control-regex
	return basename.replaceAll(/[\u0000-\u001F<>:"/\\|?*]/g, replacement);
}

/** Converts an URL into a safe file path. */
export function urlToFilePath(url: URL, {
	baseDir = '.',
} = {}): string {
	const pathSegments = url.href.split('/').map((segment) => {
		return sanitizeFilename(decodeURIComponent(segment), '!');
	});
	return join(baseDir, ...pathSegments);
}
