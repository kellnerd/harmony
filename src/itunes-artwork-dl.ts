import { getSourceImage } from './providers/iTunes.ts';
import { parse } from 'std/flags/mod.ts';
import { ensureDir, exists } from 'std/fs/mod.ts';
import { basename, extname, join } from 'std/path/mod.ts';

import type { Artist, Collection, Result } from './providers/iTunes.ts';

export type ImageDownloadOptions = {
	/** Destination directory where downloaded files will be saved. */
	destinationDir?: string;
	/** Maximum size of the image (format: `${width}x${height}`), defaults to the original image size. */
	size?: string;
};

export async function downloadCover(release: Collection, {
	destinationDir = '.',
	size,
}: ImageDownloadOptions = {}) {
	let imageSource: URL;
	if (size?.match(/^\d+x\d+$/)) {
		imageSource = new URL(release.artworkUrl100.replace('100x100', size));
	} else {
		imageSource = getSourceImage(release.artworkUrl100);
	}

	const imageExtension = extname(imageSource.pathname);
	const imageName = `${sanitizeFilename(release.collectionName)} [${release.collectionId}]`;
	const destination = join(destinationDir, imageName + imageExtension);

	if (!await exists(destination)) {
		console.info(`Saving ${imageSource} as '${destination}'`);
		try {
			await downloadFile(imageSource, destination);
		} catch (err) {
			console.error(`Download of cover '${imageSource}' failed:`, err);
		}
	} else {
		console.info(`Skipping image, '${imageName}' already exists`);
	}
}

export async function downloadFile(source: URL, destination: string) {
	const response = await fetch(source);
	if (response.ok && response.body) {
		await Deno.writeFile(destination, response.body);
	} else {
		throw new Error(response.statusText);
	}
}

export type SubstitutionRule = [string | RegExp, string];

/**
 * Replaces all illegal characters inside the given name to form a valid filename (UNIX and Windows).
 * @param basename - Basename of the file.
 * @param substitutionRules - Pairs of values for custom search & replace operations.
 * @param replacement - Replacement for all remaining illegal characters, defaults to an underscore.
 */
export function sanitizeFilename(basename: string, substitutionRules: SubstitutionRule[] = [], replacement = '_') {
	// https://learn.microsoft.com/en-gb/windows/win32/fileio/naming-a-file#naming-conventions
	// deno-lint-ignore no-control-regex
	const illegalCharacters = /[\u0000-\u001F<>:"/\\|?*]/g;
	substitutionRules.push([illegalCharacters, replacement]);

	substitutionRules.forEach(([searchValue, replaceValue]) => {
		basename = basename.replaceAll(searchValue, replaceValue);
	});

	return basename;
}

export const iTunesUrlPattern = new URLPattern({
	hostname: '(itunes|music).apple.com',
	pathname: String.raw`/:region(\w{2})?/:type(album|artist)/:blurb?/:id(\d+)`,
});

if (import.meta.main) {
	const args = parse(Deno.args, {
		string: ['_', 'output', 'size'],
	});

	if (!args._.length) {
		console.info('Usage: itunes-artwork-dl [--output <DIR>] [--size <WxH>] <ALBUM_URL | ARTIST_URL> ...');
		Deno.exit(1);
	}

	if (args.output) {
		await ensureDir(args.output);
	}

	const iTunesLookupUrl = new URL('https://itunes.apple.com/lookup');

	for (const input of args._) {
		try {
			const inputUrl = new URL(input);

			if (iTunesUrlPattern.test(inputUrl)) {
				// download cover of the given release or for all releases of the given artist
				const urlData = iTunesUrlPattern.exec(inputUrl)!.pathname.groups;
				const query = new URLSearchParams({
					entity: 'album',
					id: urlData.id!,
					country: urlData.region ?? 'us',
					limit: '200', // maximum value, default is 50
				});
				iTunesLookupUrl.search = query.toString();

				const response = await fetch(iTunesLookupUrl);
				const data: Result<Artist | Collection> = await response.json();
				const releases = data.results.filter((result) => result.wrapperType === 'collection') as Collection[];

				for (const release of releases) {
					await downloadCover(release, { destinationDir: args.output, size: args.size });
				}
			} else {
				// download content for arbitrary URL
				const filename = basename(inputUrl.pathname);
				const destination = join(args.output ?? '.', filename);
				console.info(`Saving ${inputUrl} as '${destination}'`);
				await downloadFile(inputUrl, destination);
			}
		} catch (err) {
			console.error(`Download of '${input}' failed:`, err);
		}
	}
}
