import { mergeRelease } from '@/harmonizer/merge.ts';
import { allProviderSimpleNames, providerMap, providerPreferences, providers } from '@/providers/mod.ts';
import { LookupError } from '@/utils/errors.ts';
import { ensureValidGTIN } from '@/utils/gtin.ts';
import { formatLanguageConfidence, formatScriptFrequency } from '@/utils/locale.ts';
import { isDefined } from '@/utils/predicate.ts';
import { detectScripts, scriptCodes } from '@/utils/script.ts';
import lande from 'lande';
import { zipObject } from 'utils/object/zipObject.js';
import { simplifyName } from 'utils/string/simplify.js';

import type {
	GTIN,
	HarmonyRelease,
	ProviderMessage,
	ProviderName,
	ProviderNameAndId,
	ProviderReleaseMapping,
	ReleaseOptions,
} from '@/harmonizer/types.ts';

/** Parameters which can be used to lookup a release. */
export type ReleaseLookupParameters = {
	/** GTIN of the release. */
	gtin?: GTIN;
	/** Pairs of simplified provider names and provider IDs. */
	providerIds?: ProviderNameAndId[];
	/** Provider URLs. */
	urls?: URL[];
};

/**
 * Looks up a release for each of the given lookup parameters.
 *
 * Supports GTIN, provider IDs and URLs as input.
 * Each provider can only be used once, IDs will be used before URLs and GTIN.
 *
 * All remaining supported providers will be used for GTIN lookups, unless only specific providers have been requested.
 * GTIN lookups are only possible if the GTIN is available, that is:
 * - GTIN has been specified as lookup parameter.
 * - GTIN could be extracted from the (first available) result of another lookup.
 */
export async function lookupRelease(lookup: ReleaseLookupParameters, options?: ReleaseOptions) {
	// Use all supported providers if no specific ones were requested.
	// Providers for which we have an ID or URL will not be looked up by GTIN.
	const gtinLookupProviders = new Set(options?.providers ?? allProviderSimpleNames);
	const promisedReleases: Promise<HarmonyRelease>[] = [];
	const usedProviderNames = new Set<string>();
	const messages: ProviderMessage[] = [];

	if (lookup.providerIds?.length) {
		for (const [providerSimpleName, id] of lookup.providerIds) {
			const provider = providerMap[providerSimpleName];
			if (provider) {
				const providerName = provider.name;
				if (usedProviderNames.has(providerName)) {
					messages.push({
						type: 'error',
						text: `Provider ${providerName} can only be used once per lookup, ignoring ID '${id}'`,
					});
				} else {
					promisedReleases.push(provider.getRelease(id, options));
					usedProviderNames.add(providerName);
					gtinLookupProviders.delete(providerSimpleName);
				}
			} else {
				messages.push({
					type: 'error',
					text: `There is no provider with the simplified name ${providerSimpleName}`,
				});
			}
		}
	}

	if (lookup.urls?.length) {
		for (const url of lookup.urls) {
			const provider = providers.find((provider) => provider.supportsDomain(url));
			if (provider) {
				const providerName = provider.name;
				if (usedProviderNames.has(providerName)) {
					messages.push({
						type: 'error',
						text: `Provider ${providerName} can only be used once per lookup, ignoring ${url}`,
					});
				} else {
					promisedReleases.push(provider.getRelease(url, options));
					usedProviderNames.add(providerName);
					gtinLookupProviders.delete(simplifyName(providerName));
				}
			} else {
				messages.push({
					type: 'error',
					text: `No provider supports ${url}`,
				});
			}
		}
	}

	if (gtinLookupProviders.size) {
		let { gtin } = lookup;
		if (!gtin) {
			const firstAvailableRelease = await Promise.any(promisedReleases);
			gtin = firstAvailableRelease.gtin;
		}
		if (gtin) {
			for (const providerSimpleName of gtinLookupProviders) {
				const provider = providerMap[providerSimpleName];
				if (provider) {
					const providerName = provider.name;
					promisedReleases.push(provider.getRelease(gtin, options));
					usedProviderNames.add(providerName);
				} else {
					messages.push({
						type: 'error',
						text: `There is no provider with the simplified name ${providerSimpleName}`,
					});
				}
			}
		} else {
			messages.push({
				type: 'warning',
				text: 'Lookups by GTIN were skipped because no GTIN was available',
			});
		}
	}

	return {
		result: await makeProviderReleaseMapping(Array.from(usedProviderNames), promisedReleases),
		messages,
	};
}

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
 * Looks up the given GTIN with each requested provider.
 *
 * Uses all supported providers by default.
 */
export function getProviderReleaseMapping(gtin: GTIN, options?: ReleaseOptions): Promise<ProviderReleaseMapping> {
	ensureValidGTIN(gtin);

	const requestedProviders = Array.from(options?.providers ?? allProviderSimpleNames)
		.map((simpleName) => providerMap[simpleName]).filter(isDefined);
	const requestedProviderNames = requestedProviders.map((provider) => provider.name);
	const releasePromises = requestedProviders.map((provider) => provider.getRelease(gtin, options));

	return makeProviderReleaseMapping(requestedProviderNames, releasePromises);
}

async function makeProviderReleaseMapping(
	usedProviderNames: ProviderName[],
	promisedReleases: Promise<HarmonyRelease>[],
): Promise<ProviderReleaseMapping> {
	const releaseResults = await Promise.allSettled(promisedReleases);
	const releasesOrErrors: Array<HarmonyRelease | Error> = releaseResults.map((result) => {
		if (result.status === 'fulfilled') {
			return result.value;
		} else if (result.reason instanceof Error) {
			return result.reason;
		} else {
			return Error(result.reason);
		}
	});

	return zipObject(usedProviderNames, releasesOrErrors);
}

/**
 * Looks up the given GTIN with each provider and merges the resulting releases into one.
 */
export async function getMergedReleaseByGTIN(
	gtin: GTIN,
	options?: ReleaseOptions,
): Promise<HarmonyRelease> {
	const releaseMap = await getProviderReleaseMapping(gtin, options);
	const release = mergeRelease(releaseMap, providerPreferences);

	detectLanguageAndScript(release);

	return release;
}

/**
 * Looks up the given URL with the first matching provider.
 * Then tries to find that release on other providers (by GTIN) and merges the resulting data.
 */
export async function getMergedReleaseByUrl(url: URL, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
	const release = await getReleaseByUrl(url, options);

	if (release.gtin) {
		const usedRegion = release.info.providers[0]?.lookup.region;
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
