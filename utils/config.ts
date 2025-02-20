/**
 * Retrieves the value of an environment variable.
 *
 * Returns `undefined` if the given environment variable is not defined.
 */
export function getFromEnv(key: string): string | undefined {
	if ('Deno' in self) {
		return Deno.env.get(key);
	}
}

/**
 * Retrieves the value of an environment variable and interprets it as a boolean.
 *
 * Defaults to `false` if the given environment variable is not defined.
 */
export function getBooleanFromEnv(key: string): boolean {
	const value = getFromEnv(key);
	return value !== undefined && ['1', 'true', 'yes'].includes(value.toLowerCase());
}

/**
 * Retrieves the value of an environment variable and converts it into an URL.
 *
 * Returns the fallback URL if the given environment variable is not defined.
 */
export function getUrlFromEnv(key: string, fallback: string | URL): URL {
	return new URL(getFromEnv(key) || fallback);
}
