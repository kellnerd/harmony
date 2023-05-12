import { mergeRelease } from './harmonizer/merge.ts';
import { providerNames, providers } from './providers.ts';
import { LookupError } from './utils/errors.ts';
import { detectScripts, scriptCodes } from './utils/script.ts';
import { francAll } from 'franc';
import { zipObject } from 'utils/object/zipObject.js';

import type { GTIN, HarmonyRelease, ProviderReleaseMapping, ReleaseOptions } from './harmonizer/types.ts';

/**
 * Looks up the given URL with the first matching provider.
 */
export async function getReleaseByUrl(url: URL, options?: ReleaseOptions): Promise<HarmonyRelease> {
	const matchingProvider = providers.find((provider) => provider.supportsDomain(url));

	if (!matchingProvider) {
		throw new LookupError(`No provider supports ${url}`);
	}

	const release = await matchingProvider.getRelease(url, options);
	detectLanguageAndScript(release);

	return release;
}

/**
 * Looks up the given GTIN with each provider.
 */
export async function getProviderReleaseMapping(gtin: GTIN, options?: ReleaseOptions): Promise<ProviderReleaseMapping> {
	const releasePromises = providers.map((provider) => provider.getReleaseByGTIN(gtin, options));
	const releaseResults = await Promise.allSettled(releasePromises);
	const releases = releaseResults.map((result) => result.status === 'fulfilled' ? result.value : undefined);

	return zipObject(providerNames, releases);
}

/**
 * Looks up the given GTIN with each provider and merges the resulting releases into one.
 */
export async function getMergedReleaseByGTIN(
	gtin: GTIN,
	options?: ReleaseOptions,
): Promise<HarmonyRelease | undefined> {
	const releaseMap = await getProviderReleaseMapping(gtin, options);
	const release = mergeRelease(releaseMap);

	if (release) detectLanguageAndScript(release);

	return release;
}

function detectLanguageAndScript(release: HarmonyRelease): void {
	const allTitles = release.media.flatMap((medium) => medium.tracklist.map((track) => track.title));
	allTitles.push(release.title);

	if (!release.mainScript) {
		const mainScript = detectScripts(allTitles.join('\n'), scriptCodes)[0];
		if (mainScript?.frequency > 0.7) {
			release.mainScript = mainScript;
		}
	}

	if (!release.language) {
		const guessedLanguage = francAll(allTitles.join('\n'))[0];
		if (guessedLanguage[1] > 0.9) {
			release.language = {
				code: guessedLanguage[0],
				confidence: guessedLanguage[1],
			};
		}
	}
}
