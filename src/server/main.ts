import manifest from './fresh.gen.ts';
import { start } from 'fresh/server.ts';

await start(manifest);
