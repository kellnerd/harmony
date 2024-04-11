// automatically load .env environment variable file (before everything else)
import 'std/dotenv/load.ts';

import manifest from './fresh.gen.ts';
import { start } from 'fresh/server.ts';

await start(manifest);
