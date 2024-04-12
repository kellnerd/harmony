/** Source code URL. */
export const codeUrl = Deno.env.get('HARMONY_CODE_URL') || 'https://github.com/kellnerd/harmony/';

/** User support URL. */
export const supportUrl = Deno.env.get('HARMONY_SUPPORT_URL') || new URL('issues', codeUrl).href;

/** Current git revision. */
export const revision = Deno.env.get('DENO_DEPLOYMENT_ID');
