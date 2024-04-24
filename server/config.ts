/** Source code URL. */
export const codeUrl = getUrlFromEnv('HARMONY_CODE_URL', 'https://github.com/kellnerd/harmony/');

/** User support URL. */
export const supportUrl = getUrlFromEnv('HARMONY_SUPPORT_URL', new URL('issues', codeUrl));

/** Base URL of the MusicBrainz server which should be used (for seeding and API requests). */
export const musicbrainzBaseUrl = getUrlFromEnv('MUSICBRAINZ_URL', 'https://musicbrainz.org/');

/** Current git revision. */
export const revision = Deno.env.get('DENO_DEPLOYMENT_ID');

/** Source code URL for the current git revision. */
export const codeRevisionUrl = (revision && codeUrl.hostname === 'github.com')
	? new URL(`tree/${revision}`, codeUrl)
	: undefined;

/** Indicates whether the protocol of a client from the `X-Forwarded-Proto` proxy header should be used. */
export const forwardProto = getBooleanFromEnv('FORWARD_PROTO');

function getBooleanFromEnv(key: string): boolean {
	let value: string | undefined;
	if ('Deno' in self) {
		value = Deno.env.get(key);
	}
	return value !== undefined && ['1', 'true', 'yes'].includes(value.toLowerCase());
}

function getUrlFromEnv(key: string, fallback: string | URL): URL {
	let value: string | undefined;
	if ('Deno' in self) {
		value = Deno.env.get(key);
	}
	return new URL(value || fallback);
}
