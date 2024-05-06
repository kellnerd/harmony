/** Source code URL. */
export const codeUrl = getUrlFromEnv('HARMONY_CODE_URL', 'https://github.com/kellnerd/harmony/');

/** User support URL. */
export const supportUrl = getUrlFromEnv('HARMONY_SUPPORT_URL', new URL('issues', codeUrl));

/** Base URL of the MusicBrainz server which should be used (for seeding and API requests). */
export const musicbrainzBaseUrl = getUrlFromEnv('MUSICBRAINZ_URL', 'https://musicbrainz.org/');

/** Current git revision. */
export const revision = getFromEnv('DENO_DEPLOYMENT_ID');

/** Current git revision, shortened if it is a hash, or "unknown". */
export const shortRevision = revision
	? (/^[0-9a-f]+$/.test(revision) ? revision.substring(0, 7) : revision)
	: 'unknown';

/** Source code URL for the current git revision. */
export const codeRevisionUrl = (revision && codeUrl.hostname === 'github.com')
	? new URL(`tree/${revision}`, codeUrl)
	: undefined;

/** Indicates whether the protocol of a client from the `X-Forwarded-Proto` proxy header should be used. */
export const forwardProto = getBooleanFromEnv('FORWARD_PROTO');

/** Indicates whether the current server runs in development mode. */
export const isDevServer = !revision;

function getFromEnv(key: string): string | undefined {
	if ('Deno' in self) {
		return Deno.env.get(key);
	}
}

function getBooleanFromEnv(key: string): boolean {
	const value = getFromEnv(key);
	return value !== undefined && ['1', 'true', 'yes'].includes(value.toLowerCase());
}

function getUrlFromEnv(key: string, fallback: string | URL): URL {
	return new URL(getFromEnv(key) || fallback);
}
