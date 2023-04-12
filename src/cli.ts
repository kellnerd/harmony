import { GTIN } from './providers/common.ts';
import DeezerProvider from './providers/Deezer.ts';
import { parse } from 'std/flags/mod.ts';

const deezer = new DeezerProvider();

const args = parse(Deno.args, {
	boolean: ['isrc', 'multi-disc'],
	string: '_', // do not parse numeric positional arguments
});

if (args._.length === 1) {
	let specifier: GTIN | string | URL = args._[0];

	try {
		specifier = new URL(specifier);
	} catch {
		// not a valid URL, treat specifier as GTIN or ID
	}

	const release = await deezer.getRelease(specifier, {
		withISRC: args['isrc'],
		withSeparateMedia: args['multi-disc'],
	});

	console.log(JSON.stringify(release));
} else {
	console.info('Usage: deno task cli <barcode | id | url> [--isrc] [--multi-disc]');
}
