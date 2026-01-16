import { normalizeReleaseISRCs } from '@/harmonizer/isrc.ts';
import { detectLanguageAndScript } from '@/harmonizer/language_script.ts';
import { MergeOptions, mergeRelease } from '@/harmonizer/merge.ts';
import { cleanupBogusReleaseLabels } from '@/harmonizer/release_label.ts';
import { defaultProviderPreferences, providers } from '@/providers/mod.ts';
import { FeatureQuality } from '@/providers/features.ts';
import { LookupError, ProviderError } from '@/utils/errors.ts';
import { ensureValidGTIN, isEqualGTIN, uniqueGtinSet } from '@/utils/gtin.ts';
import { isDefined, isNotError } from '@/utils/predicate.ts';
import { ResponseError } from 'snap-storage';
import { getLogger } from 'std/log/get_logger.ts';
import { LogLevels } from 'std/log/levels.ts';
import { zipObject } from 'utils/object/zipObject.js';

import type {
	GTIN,
	HarmonyRelease,
	MergedHarmonyRelease,
	ProviderMessage,
	ProviderNameAndId,
	ProviderReleaseErrorMap,
	ReleaseOptions,
} from '@/harmonizer/types.ts';
import type { Logger } from 'std/log/logger.ts';

/** Parameters which can be used to lookup a release. */
export type ReleaseLookupParameters = {
	/** GTIN of the release. */
	gtin: GTIN | undefined;
	/** Pairs of provider names (internal or display names) and provider IDs. */
	providerIds: ProviderNameAndId[];
	/** Provider URLs. */
	urls: URL[];
};

/**
 * Performs a combined lookup of a release with each of the given lookup parameters.
 *
 * Supports GTIN (has to be unique), provider IDs and URLs as input.
 * Each provider can only be used once, IDs will be used before URLs and GTIN.
 *
 * All remaining supported providers will be used for GTIN lookups, unless only specific providers have been requested.
 * GTIN lookups are only possible if the GTIN is available of course.
 */
export class CombinedReleaseLookup {
	constructor(lookup: Partial<ReleaseLookupParameters>, options?: ReleaseOptions) {
		this.log = getLogger('harmony.lookup');
		// Create a deep copy, we don't want to manipulate the caller's options later on.
		this.options = { ...options };
		this.gtinLookupProviders = new Set(options?.providers ?? providers.internalNames);

		if (lookup.providerIds?.length) {
			for (const [providerName, id] of lookup.providerIds) {
				this.queueLookupById(providerName, id);
			}
		}
		if (lookup.urls?.length) {
			for (const url of lookup.urls) {
				this.queueLookupByUrl(url);
			}
		}
		if (this.gtinLookupProviders.size && lookup.gtin) {
			this.queueLookupsByGTIN(lookup.gtin);
		}
	}

	/** Initiates a new lookup by provider ID and adds it to the combined lookup. */
	queueLookupById(providerName: string, id: string): boolean {
		const provider = providers.findByName(providerName);
		if (provider) {
			const displayName = provider.name;
			if (this.queuedProviderNames.has(displayName)) {
				this.messages.push({
					type: 'error',
					text: `Provider ${displayName} can only be used once per lookup, ignoring ID '${id}'`,
				});
				return false;
			} else {
				this.queuedReleases.push(provider.getRelease(id, this.options));
				this.queuedProviderNames.add(displayName);
				this.gtinLookupProviders.delete(provider.internalName);
				return true;
			}
		} else {
			this.messages.push({
				type: 'error',
				text: `There is no provider with the name "${providerName}"`,
			});
			return false;
		}
	}

	/** Initiates a new lookup by provider URL and adds it to the combined lookup. */
	queueLookupByUrl(url: URL): boolean {
		const provider = providers.findByUrl(url);
		if (provider) {
			const displayName = provider.name;
			if (this.queuedProviderNames.has(displayName)) {
				this.messages.push({
					type: 'error',
					text: `Provider ${displayName} can only be used once per lookup, ignoring ${url}`,
				});
				return false;
			} else {
				this.queuedReleases.push(provider.getRelease(url, this.options));
				this.queuedProviderNames.add(displayName);
				this.gtinLookupProviders.delete(provider.internalName);
				return true;
			}
		} else {
			this.messages.push({
				type: 'error',
				text: `No provider supports ${url}`,
			});
			return false;
		}
	}

	/** Initiates new lookups by GTIN (for the remaining providers) and adds them to the combined lookup. */
	queueLookupsByGTIN(gtin: GTIN): boolean {
		// If the GTIN is already set, trying to change it is considered an error.
		if (this.gtin) {
			if (isEqualGTIN(gtin, this.gtin)) return true;
			this.messages.push({
				type: 'error',
				text: `Different GTIN '${gtin}' can not be combined with the current lookup`,
			});
			return false;
		}

		try {
			ensureValidGTIN(gtin);
		} catch (error) {
			this.messages.push({
				type: 'error',
				text: (error as Error).message,
			});
			return false;
		}
		this.gtin = gtin.toString();

		for (const providerName of this.gtinLookupProviders) {
			const provider = providers.findByName(providerName);
			if (provider) {
				if (provider.getQuality('GTIN lookup') != FeatureQuality.MISSING) {
					this.queuedReleases.push(provider.getRelease(['gtin', this.gtin], this.options));
					this.queuedProviderNames.add(provider.name);
				} else {
					this.messages.push({
						provider: provider.name,
						type: 'warning',
						text: 'GTIN lookups are not supported',
					});
				}
			} else {
				this.messages.push({
					type: 'error',
					text: `There is no provider with the name "${providerName}"`,
				});
			}
		}
		return true;
	}

	/** Finalizes all queued lookup requests and returns the provider release mapping. */
	async getProviderReleaseMapping(): Promise<ProviderReleaseErrorMap> {
		if (!this.queuedReleases.length) {
			const lookupErrors = this.messages
				.filter((message) => message.type === 'error')
				.map((message) => new LookupError(message.text));
			switch (lookupErrors.length) {
				case 0:
					throw new LookupError('No release lookups have been queued');
				case 1:
					throw lookupErrors[0];
				default:
					throw new AggregateError(lookupErrors, 'Release lookup failed');
			}
		}

		// Exit early if our cached release map is up to date.
		if (this.processedProviders === this.queuedReleases.length) {
			return this.cachedReleaseMap;
		}

		const releaseResults = await Promise.allSettled(this.queuedReleases);
		const releasesOrErrors: Array<HarmonyRelease | Error> = await Promise.all(releaseResults.map(async (result) => {
			if (result.status === 'fulfilled') {
				return result.value;
			} else {
				const { reason } = result;
				if (reason instanceof Error) {
					if (reason instanceof LookupError) {
						// No need to log a stack trace, these are our own errors.
						if (reason instanceof ProviderError) {
							this.log.info(`${reason.providerName}: ${reason.message}`);
						} else {
							this.log.info(reason.message);
						}
					} else if (reason instanceof ResponseError) {
						const { status, statusText } = reason.response;
						this.log.warn(`${reason.message} (${status} ${statusText})`);
						if (this.log.level <= LogLevels.DEBUG) {
							const responseText = await reason.response.text();
							if (responseText.length) {
								this.log.debug(responseText.trim());
							}
						}
					} else {
						// Unexpected errors are more critical.
						this.log.error(reason);
					}
					return reason;
				} else {
					return Error(reason);
				}
			}
		}));

		this.cachedReleaseMap = zipObject(Array.from(this.queuedProviderNames), releasesOrErrors);
		this.processedProviders = this.queuedReleases.length;

		return this.cachedReleaseMap;
	}

	/** Ensures that all requested providers have been looked up and returns the provider release mapping. */
	async getCompleteProviderReleaseMapping(): Promise<ProviderReleaseErrorMap> {
		await this.getProviderReleaseMapping();

		// Exit early if our cached release map is up to date.
		if (this.completelyProcessedProviders === this.queuedReleases.length) {
			return this.cachedReleaseMap;
		}

		// We might still have providers left for which we have not done a lookup because the GTIN was not available.
		if (this.gtinLookupProviders.size && !this.gtin) {
			const releases = Object.values(this.cachedReleaseMap).filter(isNotError);

			// Use already used or available regions of the completed release lookups instead of the standard preferences.
			const usedRegions = releases.map((release) => release.info.providers[0].lookup.region).filter(isDefined);
			if (usedRegions.length) {
				this.options.regions = new Set(usedRegions);
			} else {
				const availableRegions = new Set(releases.flatMap((release) => release.availableIn ?? []));
				// Remove special "worldwide" region, it is not usable for lookups.
				availableRegions.delete('XW');
				if (availableRegions.size) {
					// Remove all preferred regions where the release is unlikely to be available.
					if (this.options.regions?.size) {
						const availablePreferredRegions = new Set(this.options.regions);
						for (const region of availablePreferredRegions) {
							if (!availableRegions.has(region)) {
								availablePreferredRegions.delete(region);
							}
						}
						this.options.regions = availablePreferredRegions;
					}
					// Use available regions if no (available) preferred regions remain.
					if (!this.options.regions?.size) {
						this.options.regions = availableRegions;
					}
				}
			}

			// Obtain GTIN candidates from the already completed release lookups.
			const gtinCandidates = releases.map((release) => release.gtin).filter(isDefined);
			const uniqueGtinValues = uniqueGtinSet(gtinCandidates);

			switch (uniqueGtinValues.size) {
				case 1:
					// Queue new lookups and get the updated release mapping.
					if (this.queueLookupsByGTIN(gtinCandidates[0])) {
						this.cachedReleaseMap = await this.getProviderReleaseMapping();
					}
					break;
				case 0: {
					const skippedProviders = Array.from(this.gtinLookupProviders)
						.map((internalName) => providers.toDisplayName(internalName) ?? internalName);
					this.messages.push({
						type: 'info',
						text: `GTIN is unknown, lookups for the following providers were skipped: ${skippedProviders.join(', ')}`,
					});
					break;
				}
				default:
					this.messages.push({
						type: 'error',
						text: `Providers have returned multiple different GTIN: ${gtinCandidates.join(', ')}`,
					});
			}
		}

		this.completelyProcessedProviders = this.queuedReleases.length;

		return this.cachedReleaseMap;
	}

	/** Ensures that all requested providers have been looked up and returns the combined release. */
	async getMergedRelease(options?: MergeOptions): Promise<MergedHarmonyRelease> {
		const releaseMap = await this.getCompleteProviderReleaseMapping();
		const release = mergeRelease(releaseMap, options);
		// Prepend error and warning messages of the combined lookup.
		release.info.messages.unshift(...this.messages);

		// Provider-independent post-processing of the merged release.
		detectLanguageAndScript(release);
		normalizeReleaseISRCs(release);
		if (release.labels) {
			cleanupBogusReleaseLabels(release.labels);
		}

		return release;
	}

	private log: Logger;

	private options: ReleaseOptions;

	private gtin: string | undefined;

	/** Internal names of providers which will be used for GTIN lookups. */
	private gtinLookupProviders: Set<string>;

	private queuedReleases: Promise<HarmonyRelease>[] = [];

	/** Display names of all queued providers. */
	private queuedProviderNames = new Set<string>();

	/** Caches the latest provider release mapping. */
	private cachedReleaseMap: ProviderReleaseErrorMap = {};

	/** Number of already processed providers for the cached release map. */
	private processedProviders = 0;

	/** Number of already completely processed providers for the cached release map. */
	private completelyProcessedProviders = 0;

	/** Warnings and errors from the combined lookup process. */
	messages: ProviderMessage[] = [];
}

/**
 * Looks up the given URL with the first matching provider.
 */
export function getReleaseByUrl(url: URL, options?: ReleaseOptions): Promise<HarmonyRelease> {
	const matchingProvider = providers.findByUrl(url);

	if (!matchingProvider) {
		throw new LookupError(`No provider supports ${url}`);
	}

	return matchingProvider.getRelease(url, options);
}

/**
 * Looks up the given GTIN with each provider and merges the resulting releases into one.
 */
export function getMergedReleaseByGTIN(
	gtin: GTIN,
	options?: ReleaseOptions,
): Promise<MergedHarmonyRelease> {
	const lookup = new CombinedReleaseLookup({ gtin }, options);
	return lookup.getMergedRelease({
		prefer: defaultProviderPreferences,
	});
}

/**
 * Looks up the given URL with the first matching provider.
 * Then tries to find that release on other providers (by GTIN) and merges the resulting data.
 */
export function getMergedReleaseByUrl(url: URL, options?: ReleaseOptions): Promise<MergedHarmonyRelease> {
	const lookup = new CombinedReleaseLookup({ urls: [url] }, options);
	return lookup.getMergedRelease({
		prefer: defaultProviderPreferences,
	});
}
