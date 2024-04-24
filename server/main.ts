// Automatically load .env environment variable file (before everything else).
import 'std/dotenv/load.ts';

import manifest from './fresh.gen.ts';
import { start } from 'fresh/server.ts';

const abortController = new AbortController();
const isWindows = Deno.build.os === 'windows';

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
	// On Windows only "SIGINT" (CTRL+C) and "SIGBREAK" (CTRL+Break) are supported.
	if (isWindows && signal !== 'SIGINT') break;

	Deno.addSignalListener(signal, () => {
		console.info(`App received '${signal}', aborting...`);
		abortController.abort(signal);
	});
}

await start(manifest, { server: { signal: abortController.signal } });

console.info('Fresh server and all its connections were closed.');

// Explicitly exit, otherwise dev servers would restart on file changes.
Deno.exit();
