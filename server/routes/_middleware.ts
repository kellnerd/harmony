import type { FreshContext } from 'fresh/server.ts';
import { forwardProto } from '@/server/config.ts';

/** Ensures that generated links are correct when the app is hosted behind a HTTPS reverse proxy. */
function forwardProtoHandler(req: Request, ctx: FreshContext) {
	const forwardedProto = req.headers.get('X-Forwarded-Proto');
	if (forwardedProto === 'https') {
		ctx.url.protocol = forwardedProto;
	}

	return ctx.next();
}

export const handler: Array<(req: Request, ctx: FreshContext) => Promise<Response>> = [];

if (forwardProto) handler.push(forwardProtoHandler);
