import { getBooleanFromEnv, getFromEnv, getUrlFromEnv } from '@/utils/config.ts';
import { join } from 'std/url/join.ts';

/** Source code URL. */
export const codeUrl = getUrlFromEnv('HARMONY_CODE_URL', 'https://github.com/kellnerd/harmony');

/** User support URL. */
export const supportUrl = getUrlFromEnv('HARMONY_SUPPORT_URL', join(codeUrl, 'issues'));

/** Base URL of the MusicBrainz server which should be used (for seeding and API requests). */
export const musicbrainzBaseUrl = getUrlFromEnv('MUSICBRAINZ_URL', 'https://musicbrainz.org/');

/** Current git revision of the app. */
export const revision = getFromEnv('DENO_DEPLOYMENT_ID');

/** Current git revision, shortened if it is a hash, or "unknown". */
export const shortRevision = revision
	? (/^[0-9a-f]+$/.test(revision) ? revision.substring(0, 7) : revision)
	: 'unknown';

/** Source code URL for the current git revision. */
export const codeRevisionUrl = (revision && codeUrl.hostname === 'github.com')
	? join(codeUrl, 'tree', revision)
	: undefined;

/** Indicates whether the current app runs in development mode. */
export const inDevMode = !revision;

/** Indicates whether the protocol of a client from the `X-Forwarded-Proto` proxy header should be used. */
export const forwardProto = getBooleanFromEnv('FORWARD_PROTO');
