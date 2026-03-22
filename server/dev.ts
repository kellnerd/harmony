#!/usr/bin/env -S deno run -A --watch=static/,routes/

// Automatically load .env environment variable file (before anything else).
import '@std/dotenv/load';

import dev from 'fresh/dev.ts';

await dev(import.meta.url, './main.ts');
