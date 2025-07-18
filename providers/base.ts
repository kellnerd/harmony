import { FeatureQuality, type FeatureQualityMap, type ProviderFeature } from './features.ts';
import { CacheMissError, ProviderError, ResponseError } from '@/utils/errors.ts';
import { pluralWithCount } from '@/utils/plural.ts';
import { delay } from 'std/async/delay.ts';
import { getLogger } from 'std/log/get_logger.ts';
import { rateLimit } from 'utils/async/rateLimit.js';
import { simplifyName } from 'utils/string/simplify.js';

import type { AppInfo } from '@/app.ts';
import type {
	CountryCode,
	EntityId,
	ExternalEntityId,
	HarmonyEntityType,
	HarmonyRelease,
	LinkType,
	MessageType,
	ProviderMessage,
	ReleaseInfo,
	ReleaseLookupParameters,
	ReleaseOptions,
	ReleaseSpecifier,
} from '@/harmonizer/types.ts';
import type { PartialDate } from '@/utils/date.ts';
import type { CacheOptions, Policy, Snapshot, SnapStorage } from 'snap-storage';
import type { MaybePromise } from 'utils/types.d.ts';
import type { Logger } from 'std/log/logger.ts';

export type ProviderOptions = Partial<{
	/** Information about the application. */
	appInfo: AppInfo;
	/** Duration of one rate-limiting interval for requests (in ms). */
	rateLimitInterval: number | null;
	/** Maximum number of requests within the interval. */
	concurrentRequests: number;
	/**
	 * Maximum delay between the time a request is queued and its execution (in ms).
	 *
	 * Only used if rate limiting is enabled, i.e. a rate limiting interval is set.
	 * Excess requests will be rejected immediately.
	 */
	requestMaxDelay: number;
	/** Storage which will be used to cache requests (optional). */
	snaps: SnapStorage;
}>;

export interface OfflineCacheOptions extends CacheOptions {
	/** Only use cached snapshots, never fetch a network resource. */
	offline?: boolean;
}

export type MetadataProviderConstructor = new (
	...args: ConstructorParameters<typeof MetadataProvider>
) => MetadataProvider;

/**
 * Abstract metadata provider which looks up releases from a specific source.
 * Converts the raw metadata into a common representation.
 */
export abstract class MetadataProvider {
	constructor({
		rateLimitInterval = null,
		concurrentRequests = 1,
		requestMaxDelay = 30e3,
		snaps,
	}: ProviderOptions = {}) {
		this.snaps = snaps;
		this.requestMaxDelay = requestMaxDelay;

		if (rateLimitInterval && rateLimitInterval > 0) {
			this.fetch = rateLimit(fetch, {
				interval: rateLimitInterval,
				requestsPerInterval: concurrentRequests,
				maxQueueSize: requestMaxDelay / rateLimitInterval,
				queueFullError: 'Too many requests queued, please wait and try again',
			});
		}
	}

	/** Display name of the metadata source, has to be unique. */
	abstract readonly name: string;

	/** Simplified internal name of the metadata source, has to be unique. */
	get internalName(): string {
		return simplifyName(this.name);
	}

	/**
	 * URL pattern used to check supported domains, match entity URLs and extract entity type and ID from the URL.
	 *
	 * The pathname has to contain two named groups `type` and `id`, e.g. `/:type(artist|release)/:id`.
	 * Optionally the pathname can also contain the following named groups which will be extracted:
	 * - `region`: preferred region
	 * - `slug`: slug which can be used to reconstruct the original canonical URL
	 *
	 * If these groups are not contained in the pathname, {@linkcode extractEntityFromUrl} has to be overwritten.
	 */
	abstract readonly supportedUrls: URLPattern;

	/** Features of the provider and their quality. */
	readonly features: FeatureQualityMap = {};

	/** Maps MusicBrainz entity types to the corresponding entity types of the provider. */
	abstract readonly entityTypeMap: Record<HarmonyEntityType, string | string[]>;

	protected abstract releaseLookup: ReleaseLookupConstructor;

	/** Country codes of regions in which the provider offers its services (optional). */
	readonly availableRegions?: Set<CountryCode>;

	readonly launchDate: PartialDate = {};

	/** Looks up the release which is identified by the given specifier (URL, GTIN/barcode or provider ID). */
	getRelease(specifier: ReleaseSpecifier, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		const lookup = new this.releaseLookup(this, specifier, options);
		return lookup.getRelease();
	}

	/** Checks whether the provider supports the domain of the given URL. */
	supportsDomain(url: URL | string): boolean {
		return new URLPattern({ hostname: this.supportedUrls.hostname }).test(url);
	}

	/** Extracts the entity type and ID from a supported URL. */
	extractEntityFromUrl(url: URL): EntityId | undefined {
		const groups = this.supportedUrls.exec(url)?.pathname.groups;
		if (groups) {
			const { type, id, region, slug } = groups;
			if (type && id) {
				return {
					type,
					id,
					// Do not return an empty string in case the group was declared as optional and is missing from the result.
					region: region?.toUpperCase() || undefined,
					slug,
				};
			}
		}
	}

	/** Constructs a canonical entity URL for the given provider ID. */
	abstract constructUrl(entity: EntityId): URL;

	/**
	 * Maps the given entity ID to a unique provider ID for the corresponding MusicBrainz entity type.
	 *
	 * It is crucial that the entity ID can be reconstructed from the serialized ID using {@linkcode parseProviderId}.
	 * This means when multiple provider types map to the same MB type, both of these functions have to be overridden.
	 */
	serializeProviderId(entity: EntityId): string {
		return entity.id;
	}

	/**
	 * Maps a provider ID of the given MusicBrainz entity type to provider entity type and ID.
	 *
	 * Accepts provider IDs which were serialized by {@linkcode serializeProviderId}.
	 */
	parseProviderId(id: string, entityType: HarmonyEntityType): EntityId {
		const type = this.entityTypeMap[entityType];
		if (Array.isArray(type)) {
			throw new ProviderError(
				this.name,
				`Unable to parse provider ID as the provider supports multiple ${entityType} types, please override parser`,
			);
		}
		return { id, type };
	}

	/** Returns the appropriate external link types for the given entity. */
	// deno-lint-ignore no-unused-vars
	getLinkTypesForEntity(entity: EntityId): LinkType[] {
		return [];
	}

	/** Creates external entity IDs from the given provider-specific IDs. */
	makeExternalIds(...entityIds: Array<EntityId | ExternalEntityId>): ExternalEntityId[] {
		return entityIds.map((entityId) => ({ ...entityId, provider: this.internalName }));
	}

	/** Creates external entity IDs from the given provider entity URL. */
	makeExternalIdsFromUrl(entityUrl: URL | string, options: {
		baseUrl?: URL | string;
		linkTypes?: LinkType[];
	} = {}): ExternalEntityId[] {
		const entityId = this.extractEntityFromUrl(new URL(entityUrl, options.baseUrl));
		if (entityId) {
			const externalIds = this.makeExternalIds(entityId);
			if (options.linkTypes?.length) {
				externalIds[0].linkTypes = options.linkTypes;
			}
			return externalIds;
		} else {
			return [];
		}
	}

	/** Returns the quality rating of the given feature. */
	getQuality(feature: ProviderFeature): FeatureQuality {
		return this.features[feature] ?? FeatureQuality.UNKNOWN;
	}

	protected get log(): Logger {
		return getLogger('harmony.provider');
	}

	protected snaps: SnapStorage | undefined;

	protected fetch = fetch;

	/** Delay which should be awaited before the next request. */
	protected requestDelay = Promise.resolve();

	/** Maximum acceptable delay between the time a request is queued and its execution (in ms). */
	protected requestMaxDelay: number;

	protected async fetchSnapshot(
		input: string | URL,
		options?: OfflineCacheOptions,
	): Promise<Snapshot<Response>> {
		let snapshot: Snapshot<Response> | undefined;

		if (this.snaps) {
			const cachePolicy: Policy = {
				maxAge: 60 * 60 * 24, // 24 hours
				...options?.policy,
			};
			if (options?.offline) {
				const snapMeta = this.snaps.getSnap(input.toString(), cachePolicy);
				if (snapMeta) {
					const data = await Deno.readFile(snapMeta.path);
					snapshot = { ...snapMeta, content: new Response(data), isFresh: false };
				} else {
					throw new CacheMissError('No matching snapshot was found (in offline mode)');
				}
			} else {
				snapshot = await this.snaps.cache(input, {
					fetch: this.fetch,
					requestInit: options?.requestInit,
					policy: cachePolicy,
					responseMutator: options?.responseMutator,
				});
				if (snapshot.isFresh) {
					this.handleRateLimit(snapshot.content);
				}
			}
			this.log.debug(`${input} => ${snapshot?.path} (${snapshot?.isFresh ? 'fresh' : 'old'})`);
		} else {
			let response = await this.fetch(input, options?.requestInit);
			if (options?.responseMutator) {
				response = await options.responseMutator(response);
			}
			this.handleRateLimit(response);
			snapshot = {
				content: response,
				timestamp: Math.floor(Date.now() / 1000),
				isFresh: true,
				// Dummy data, not relevant in this context.
				contentHash: '',
				path: '',
			};
		}

		return snapshot;
	}

	protected async fetchJSON<Content>(
		input: string | URL,
		options?: OfflineCacheOptions,
	): Promise<CacheEntry<Content>> {
		const snapshot = await this.fetchSnapshot(input, options);

		return {
			content: await snapshot.content.json(),
			timestamp: snapshot.timestamp,
			isFresh: snapshot.isFresh ?? false,
		};
	}

	/** Handles rate limit HTTP headers and sets the request delay. */
	protected handleRateLimit(response: Response) {
		const retryAfter = response.headers.get('Retry-After');
		if (retryAfter) {
			this.log.info(`${this.name} rate limit (HTTP ${response.status}): Retry-After ${retryAfter}`);
			const retryAfterMs = parseInt(retryAfter) * 1000;
			if (retryAfterMs > 0) {
				if (retryAfterMs < this.requestMaxDelay) {
					this.requestDelay = delay(retryAfterMs);
				} else {
					throw new ProviderError(
						this.name,
						`Suggested rate limit delay is unacceptably high, cancelling request (Retry-After ${retryAfter})`,
					);
				}
			}
		}
	}
}

type ReleaseLookupConstructor = new (
	// It is probably impossible to specify the correct provider subclass here.
	// deno-lint-ignore no-explicit-any
	provider: any,
	specifier: ReleaseSpecifier,
	options: ReleaseOptions,
) => ReleaseLookup<MetadataProvider, unknown>;

export abstract class ReleaseLookup<Provider extends MetadataProvider, RawRelease> {
	/** Initializes the release lookup for the given release specifier. */
	constructor(
		protected provider: Provider,
		specifier: ReleaseSpecifier,
		options: ReleaseOptions = {},
	) {
		// Create a deep copy, we don't want to manipulate the caller's options.
		this.options = { ...options };

		// Intersect preferred regions with available regions (if defined for the provider).
		const availableRegions = this.provider.availableRegions;
		const preferredRegions = Array.from(this.options.regions ?? []);
		if (availableRegions?.size && preferredRegions.length) {
			this.options.regions = new Set(preferredRegions.filter((region) => availableRegions.has(region)));
		}

		if (specifier instanceof URL) {
			const entity = this.provider.extractEntityFromUrl(specifier);
			if (!entity) {
				throw new ProviderError(this.provider.name, `Could not extract entity from ${specifier}`);
			}

			const releaseType = this.provider.entityTypeMap['release'];
			if (
				Array.isArray(releaseType) ? !releaseType.includes(entity.type) : entity.type !== releaseType
			) {
				throw new ProviderError(this.provider.name, `${specifier} is not a release URL`);
			}
			this.entity = entity;
			this.lookup = { method: 'id', value: this.provider.serializeProviderId(entity) };

			// Prefer region of the given release URL over the standard preferences.
			if (entity.region) {
				this.lookup.region = entity.region;
				this.options.regions = new Set([entity.region]);
			}
		} else if (typeof specifier === 'string') {
			this.lookup = { method: 'id', value: specifier };
		} else if (typeof specifier === 'number') {
			this.lookup = { method: 'gtin', value: specifier.toString() };
		} else {
			this.lookup = { method: specifier[0], value: specifier[1] };
		}

		if (!this.entity && this.lookup.method === 'id') {
			this.entity = this.provider.parseProviderId(this.lookup.value, 'release');
		}
	}

	/** Parameters which are used for the current release lookup. */
	protected lookup: ReleaseLookupParameters;

	/** Release lookup options. */
	protected options: ReleaseOptions;

	/** Provider entity ID of the currently looked up release (initially undefined). */
	protected entity: EntityId | undefined;

	/** Date and time when the (last piece of) provider data was cached (in seconds since the UNIX epoch). */
	private cacheTime: number | undefined;

	/** Updates {@linkcode cacheTime}, should be called after every cached request. */
	protected updateCacheTime(timestamp: number) {
		if (!this.cacheTime || timestamp > this.cacheTime) {
			this.cacheTime = timestamp;
		}
	}

	/** Constructs an optional API URL for a release using the specified lookup options. */
	abstract constructReleaseApiUrl(): URL | undefined;

	/** Looks up the release which is identified by the specified URL, GTIN/barcode or provider ID. */
	async getRelease(): Promise<HarmonyRelease> {
		const startTime = performance.now();

		const rawRelease = await this.getRawRelease();
		const release = await this.convertRawRelease(rawRelease);
		this.withExcludedRegions(release);

		// store the elapsed time for each provider info record (just in case), although there should be only one
		const elapsedTime = performance.now() - startTime;
		release.info.providers.forEach((providerInfo) => providerInfo.processingTime = elapsedTime);

		return release;
	}

	/**
	 * Loads the raw release data for the specified lookup options.
	 * This method is only used internally and guaranteed to be called with either a GTIN or a provider ID.
	 */
	protected abstract getRawRelease(): Promise<RawRelease>;

	/** Converts the given provider-specific raw release metadata into a common representation. */
	protected abstract convertRawRelease(rawRelease: RawRelease): MaybePromise<HarmonyRelease>;

	/** Adds a message to the generated release info. */
	protected addMessage(text: string, type: MessageType = 'info'): void {
		this.messages.push({
			provider: this.provider.name,
			text,
			type,
		});
	}

	private messages: ProviderMessage[] = [];

	protected generateReleaseInfo(): ReleaseInfo {
		if (!this.entity) {
			throw new ProviderError(this.provider.name, 'Release info can only be generated with a defined entity ID');
		}

		return {
			providers: [{
				name: this.provider.name,
				internalName: this.provider.internalName,
				id: this.provider.serializeProviderId(this.entity),
				url: this.provider.constructUrl(this.entity).href,
				apiUrl: this.constructReleaseApiUrl()?.href,
				lookup: this.lookup,
				cacheTime: this.cacheTime,
			}],
			messages: this.messages,
		};
	}

	/**
	 * Shows a warning if the provider found more than the expected result for a lookup.
	 * Expects a list of URLs pointing to the extra results from the provider.
	 */
	protected warnMultipleResults(urls: string[] | URL[]) {
		const lines = urls.map((url) => `${url} ([lookup](?url=${encodeURIComponent(String(url))}))`);
		this.addMessage(
			`The API also returned ${
				pluralWithCount(urls.length, 'other result, which was skipped', 'other results, which were skipped')
			}:\n- ${lines.join('\n- ')}`,
			'warning',
		);
	}

	/** Determines excluded regions of the release (if available regions have been specified for the provider). */
	private withExcludedRegions(release: HarmonyRelease): HarmonyRelease {
		const availableRegions = this.provider.availableRegions;
		if (availableRegions?.size && release.availableIn) {
			if (release.availableIn.length) {
				const releaseAvailability = new Set(release.availableIn);
				release.excludedFrom = [...availableRegions].filter((region) => !releaseAvailability.has(region));
			} else {
				release.excludedFrom = [...availableRegions];
			}
		}

		return release;
	}
}

export interface ApiAccessToken {
	accessToken: string;
	validUntilTimestamp: number;
}

export interface ApiQueryOptions {
	/** Maximum creation date and time of snapshots which should be used (in seconds since the UNIX epoch). */
	snapshotMaxTimestamp?: number;
	/** Only use cached snapshots, never fetch a network resource. */
	offline?: boolean;
}

/** Extends `MetadataProvider` with functions common to lookups accessing web APIs. */
export abstract class MetadataApiProvider extends MetadataProvider {
	/** Must be implemented to perform a request against the specified URL. */
	abstract query<Data>(apiUrl: URL, options?: ApiQueryOptions): Promise<CacheEntry<Data>>;

	/**
	 * Returns a cached API access token.
	 *
	 * Must be passed a function `requestAccessToken` which will return a promise resolving to a
	 * `ApiAccessToken`, containing the access token and an expiration Unix timestamp. The result is
	 * cached and `requestAccessToken` only gets called if the cached token has expired.
	 */
	protected async cachedAccessToken(requestAccessToken: () => Promise<ApiAccessToken>): Promise<string> {
		const cacheKey = `${this.name}:accessToken`;
		let tokenResult = JSON.parse(localStorage.getItem(cacheKey) || '{}');
		if (
			!tokenResult?.accessToken || !tokenResult?.validUntilTimestamp || Date.now() > tokenResult.validUntilTimestamp
		) {
			tokenResult = await requestAccessToken();
			localStorage.setItem(cacheKey, JSON.stringify(tokenResult));
		}
		return tokenResult.accessToken;
	}
}

export interface ApiAllRegionsQueryOptions<Data> {
	/** Callback which should return `true` for valid data. */
	isValidData: (data: Data) => boolean;
	/** Callback which should return `false` to ignore the exception and try the next region. */
	isCriticalError?: (error: unknown) => boolean;
	/** Only use cached snapshots, never fetch a network resource. */
	offline?: boolean;
}

/** Extends `ReleaseLookup` with functions common to lookups accessing web APIs. */
export abstract class ReleaseApiLookup<Provider extends MetadataApiProvider, RawRelease>
	extends ReleaseLookup<Provider, RawRelease> {
	/** Constructs an API URL for a release using the specified lookup options. */
	abstract override constructReleaseApiUrl(): URL;

	/** Performs the query for the URL returned by {@linkcode constructReleaseApiUrl} for all configured regions until valid data is returned. */
	protected async queryAllRegions<Data>({
		isValidData,
		isCriticalError = (_) => true,
		offline,
	}: ApiAllRegionsQueryOptions<Data>): Promise<Data> {
		for (const region of this.options.regions || []) {
			this.lookup.region = region;
			const apiUrl = this.constructReleaseApiUrl();
			try {
				const cacheEntry = await this.provider.query<Data>(apiUrl, {
					snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
					offline,
				});
				if (isValidData(cacheEntry.content)) {
					this.updateCacheTime(cacheEntry.timestamp);
					return cacheEntry.content;
				}
			} catch (error: unknown) {
				// Allow the caller to ignore exceptions and retry next region.
				if (isCriticalError(error)) {
					throw error;
				}
			}
		}

		// No results were found for any region.
		throw new ResponseError(this.provider.name, 'API returned no results', this.constructReleaseApiUrl());
	}
}

/** Cache entry for a requested piece of data. */
export type CacheEntry<Content> = {
	/** Cached content. */
	content: Content;
	/** Creation date and time in seconds since the UNIX epoch. */
	timestamp: number;
	/** Indicates that the cache entry has been created by the returning method. */
	isFresh: boolean;
};
