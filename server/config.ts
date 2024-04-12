/** Source code URL. */
export const codeUrl = getUrlFromEnv('HARMONY_CODE_URL', 'https://github.com/kellnerd/harmony/');

/** User support URL. */
export const supportUrl = getUrlFromEnv('HARMONY_SUPPORT_URL', new URL('issues', codeUrl));

/** Current git revision. */
export const revision = Deno.env.get('DENO_DEPLOYMENT_ID');

function getUrlFromEnv(key: string, fallback: string | URL): URL {
	let value: string | undefined;
	if ('Deno' in self) {
		value = Deno.env.get(key);
	}
	return new URL(value || fallback);
}
