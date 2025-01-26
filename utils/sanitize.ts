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
