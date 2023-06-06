import { mergeRelease } from './harmonizer/merge.ts';
import { providerNames, providerPreferences, providers } from './providers.ts';
import { LookupError } from './utils/errors.ts';
import { ensureValidGTIN } from './utils/gtin.ts';
import { formatLanguageConfidence, formatScriptFrequency } from './utils/locale.ts';
import { detectScripts, scriptCodes } from './utils/script.ts';
import { francAll } from 'franc';
import lande from 'lande';
import { zipObject } from 'utils/object/zipObject.js';

import type { GTIN, HarmonyRelease, ProviderReleaseMapping, ReleaseOptions } from './harmonizer/types.ts';

/**
 * Looks up the given URL with the first matching provider.
 */
export function getReleaseByUrl(url: URL, options?: ReleaseOptions): Promise<HarmonyRelease> {
	const matchingProvider = providers.find((provider) => provider.supportsDomain(url));

	if (!matchingProvider) {
		throw new LookupError(`No provider supports ${url}`);
	}

	return matchingProvider.getRelease(url, options);
}

/**
 * Looks up the given GTIN with each provider.
 */
export async function getProviderReleaseMapping(gtin: GTIN, options?: ReleaseOptions): Promise<ProviderReleaseMapping> {
	ensureValidGTIN(gtin);

	const releasePromises = providers.map((provider) => provider.getReleaseByGTIN(gtin, options));
	const releaseResults = await Promise.allSettled(releasePromises);
	const releasesOrErrors: Array<HarmonyRelease | Error> = releaseResults.map((result) => {
		if (result.status === 'fulfilled') {
			return result.value;
		} else if (result.reason instanceof Error) {
			return result.reason;
		} else {
			return Error(result.reason);
		}
	});

	return zipObject(providerNames, releasesOrErrors);
}

/**
 * Looks up the given GTIN with each provider and merges the resulting releases into one.
 */
export async function getMergedReleaseByGTIN(
	gtin: GTIN,
	options?: ReleaseOptions,
): Promise<HarmonyRelease | undefined> {
	const releaseMap = await getProviderReleaseMapping(gtin, options);
	const release = mergeRelease(releaseMap, providerPreferences);

	if (release) detectLanguageAndScript(release);

	return release;
}

/**
 * Looks up the given URL with the first matching provider.
 * Then tries to find that release on other providers (by GTIN) and merges the resulting data.
 */
export async function getMergedReleaseByUrl(url: URL, options: ReleaseOptions = {}): Promise<HarmonyRelease | undefined> {
	const release = await getReleaseByUrl(url, options);

	if (release.gtin) {
		const usedRegion = release.info.providers[0]?.region;
		if (usedRegion) {
			// create a deep copy, we don't want to manipulate the caller's options
			options = { ...options };
			// prefer already used region of the first provider over the standard preferences
			options.regions = [usedRegion, ...(options.regions ?? [])];
		}

		return getMergedReleaseByGTIN(release.gtin, options);
	} else {
		detectLanguageAndScript(release);
		return release;
	}
}

function detectLanguageAndScript(release: HarmonyRelease): void {
	const allTitles = release.media.flatMap((medium) => medium.tracklist.map((track) => track.title));
	allTitles.push(release.title);

	if (!release.script) {
		const scripts = detectScripts(allTitles.join('\n'), scriptCodes);
		const mainScript = scripts[0];

		release.info.messages.push({
			type: 'debug',
			text: `Detected scripts of the titles: ${scripts.map(formatScriptFrequency).join(', ')}`,
		});

		if (mainScript?.frequency > 0.7) {
			release.script = mainScript;
		}
	}

	if (!release.language) {
		const guessedLanguages = lande(allTitles.join('\n'));
		const topLanguage = guessedLanguages[0];

		const formattedList = guessedLanguages
			.map(([code, confidence]) => ({ code, confidence }))
			.filter(({ confidence }) => confidence > 0.1)
			.map(formatLanguageConfidence);
		release.info.messages.push({
			type: 'debug',
			text: `Guessed language of the titles: ${formattedList.join(', ')}`,
		});

		if (topLanguage[1] > 0.7) {
			release.language = {
				code: topLanguage[0],
				confidence: topLanguage[1],
			};
		}
	}
}
