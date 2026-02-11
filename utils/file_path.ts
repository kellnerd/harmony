import { encodeHex } from 'std/encoding/hex.ts';
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

const encoder = new TextEncoder();

/** Converts an URL into a safe file path. */
export async function urlToFilePath(url: URL, {
	baseDir = '.',
	segmentMaxLength = 64,
	ignoreTrailingSlash = true,
} = {}): Promise<string> {
	// Reverse domain names to allow hierarchical sorting of the resulting paths.
	// Skip this step if the hostname is an IPv4 (which contains dots, but no letters).
	const { hostname } = url;
	if (/[a-z]/i.test(hostname)) {
		url.hostname = hostname.split('.').reverse().join('.');
	}

	if (!ignoreTrailingSlash && !url.search && !url.pathname.endsWith('/')) {
		// Use an empty search query to prevent name conflict between a file and a folder.
		url.href += '?';
	}

	const pathSegments = url.href.split('/').map(async (segment) => {
		if (!segment) return segment;
		segment = sanitizeFilename(decodeURIComponent(segment), '!');
		if (segment.length <= segmentMaxLength) {
			return segment;
		} else {
			// Git uses SHA-1, a representation of 7 hex digits is usually unique enough.
			const hash = await crypto.subtle.digest('SHA-1', encoder.encode(segment));
			const hashLength = 7;
			// Shorten overlong path segment and append a short hash instead.
			return [
				segment.substring(0, segmentMaxLength - hashLength - 1),
				encodeHex(hash).substring(0, hashLength),
			].join('#');
		}
	});
	return join(baseDir, ...await Promise.all(pathSegments));
}
