// Automatically load .env environment variable file and configure logger (before anything else).
import '@std/dotenv/load';
import './logging.ts';

// ---- Harmony local API bootstrap (read-only) --------------------------------
// Only start when HARMONY_API_PORT is defined. Binds to 127.0.0.1.
// Runs alongside the Fresh app.
{
	const apiPort = Deno.env.get('HARMONY_API_PORT');
	if (apiPort) {
		const { startApi } = await import('./api.ts');
		const port = Number(apiPort);
		if (Number.isFinite(port) && port > 0) {
			startApi(port, '127.0.0.1');
		}
	}
}
// ---- END Harmony local API bootstrap ----------------------------------------

import { shortRevision } from '@/config.ts';
import { start } from 'fresh/server.ts';
import { getLogger } from 'std/log/get_logger.ts';
import manifest from './fresh.gen.ts';

const log = getLogger('harmony.server');
log.info(`Revision: ${shortRevision}`);

const abortController = new AbortController();
const isWindows = Deno.build.os === 'windows';

// Attempt to gracefully close the server on SIGINT or SIGTERM.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
	// On Windows only "SIGINT" (CTRL+C) and "SIGBREAK" (CTRL+Break) are supported.
	if (isWindows && signal !== 'SIGINT') break;

	Deno.addSignalListener(signal, () => {
		log.info(`App received '${signal}', aborting...`);
		abortController.abort(signal);
	});
}

// Ignore SIGHUP, which otherwise kills the process.
if (!isWindows) {
	Deno.addSignalListener('SIGHUP', () => {
		log.warn(`App received 'SIGHUP', ignoring.`);
	});
}

// Instantiate Fresh HTTP server.
await start(manifest, { server: { signal: abortController.signal } });

log.info('Fresh server and all its connections were closed.');

// Explicitly exit, otherwise dev servers would restart on file changes.
Deno.exit();
