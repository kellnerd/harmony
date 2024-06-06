#!/usr/bin/env -S deno run -A --watch=static/,routes/

// Automatically load .env environment variable file and configure logger (before anything else).
import 'std/dotenv/load.ts';

import dev from 'fresh/dev.ts';

await dev(import.meta.url, './main.ts');
