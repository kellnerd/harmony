import { getMergedReleaseByGTIN, getReleaseByUrl } from '@/lookup.ts';
import { createReleaseSeed } from '@/musicbrainz/seeding.ts';
import { parse } from 'std/flags/mod.ts';

import type { GTIN, HarmonyRelease } from './harmonizer/types.ts';

const args = parse(Deno.args, {
	boolean: ['isrc', 'multi-disc', 'seed'],
	string: '_', // do not parse numeric positional arguments
});

if (args._.length === 1) {
	let specifier: GTIN | URL = args._[0];

	try {
		specifier = new URL(specifier);
	} catch {
		// not a valid URL, treat specifier as GTIN
	}

	const releaseOptions = {
		withISRC: args['isrc'],
		withSeparateMedia: args['multi-disc'],
	};

	let release: HarmonyRelease;

	if (specifier instanceof URL) {
		release = await getReleaseByUrl(specifier, releaseOptions);
	} else {
		release = await getMergedReleaseByGTIN(specifier, releaseOptions);
	}

	if (args.seed) {
		console.log(createReleaseSeed(release));
	} else {
		console.log(JSON.stringify(release));
	}
} else {
	console.info('Usage: deno task cli <barcode | url> [--isrc] [--multi-disc] [--seed]');
}
