import { GTIN } from './providers/common.ts';
import DeezerProvider from './providers/Deezer.ts';
import { parse } from 'std/flags/mod.ts';

const deezer = new DeezerProvider();

const args = parse(Deno.args);

if (args._.length === 1) {
	let specifier: GTIN | URL = args._[0];

	if (typeof specifier === 'string') {
		specifier = new URL(specifier);
	}

	const release = await deezer.getRelease(specifier, {
		withISRC: args['isrc'],
		withSeparateMedia: args['multi-disc'],
	});

	console.log(JSON.stringify(release));
} else {
	console.info('Usage: deno task cli <barcode | url> [--isrc] [--multi-disc]');
}
