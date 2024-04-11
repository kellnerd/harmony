/** Source code URL. */
export const codeUrl = Deno.env.get('HARMONY_CODE_URL') || 'https://github.com/kellnerd/harmony';

/** Current git revision. */
export const revision = Deno.env.get('DENO_DEPLOYMENT_ID');

/** Indicates whether the current server runs in development mode. */
export const isDevServer = !revision;
