import type { FreshContext } from 'fresh/server.ts';
import { getLogger } from 'std/log/get_logger.ts';
import { forwardProto } from '@/server/config.ts';

/** Ensures that generated links are correct when the app is hosted behind a HTTPS reverse proxy. */
function forwardProtoHandler(req: Request, ctx: FreshContext) {
	const forwardedProto = req.headers.get('X-Forwarded-Proto');
	if (forwardedProto === 'https') {
		ctx.url.protocol = forwardedProto;
	}

	return ctx.next();
}

/** Logs all incoming requests. */
function logRequest(req: Request, ctx: FreshContext) {
	const log = getLogger('requests');

	// Give interesting requests a higher log level.
	if (ctx.route === '/release') {
		log.info(req.url, req);
	} else {
		log.debug(req.url, req);
	}

	return ctx.next();
}

export const handler: Array<(req: Request, ctx: FreshContext) => Promise<Response>> = [
	logRequest,
];

if (forwardProto) handler.push(forwardProtoHandler);
