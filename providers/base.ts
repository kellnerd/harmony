import { ProviderError } from '@/utils/errors.ts';
import { rateLimit } from 'utils/async/rateLimit.js';

import type {
	CountryCode,
	HarmonyRelease,
	MessageType,
	ProviderMessage,
	ReleaseInfo,
	ReleaseLookupParameters,
	ReleaseOptions,
	ReleaseSpecifier,
} from '@/harmonizer/types.ts';
import type { PartialDate } from '@/utils/date.ts';
import type { CacheOptions, Snapshot, SnapStorage } from 'snap-storage';
import type { MaybePromise } from 'utils/types.d.ts';

export type ProviderOptions = Partial<{
	/** Duration of one rate-limiting interval for requests (in ms). */
	rateLimitInterval: number | null;
	/** Maximum number of requests within the interval. */
	concurrentRequests: number;
	/** Storage which will be used to cache requests (optional). */
	snaps: SnapStorage;
}>;

/**
 * Abstract metadata provider which looks up releases from a specific source.
 * Converts the raw metadata into a common representation.
 */
export abstract class MetadataProvider {
	constructor({
		rateLimitInterval = null,
		concurrentRequests = 1,
		snaps,
	}: ProviderOptions = {}) {
		this.snaps = snaps;

		if (rateLimitInterval && rateLimitInterval > 0) {
			this.fetch = rateLimit(fetch, rateLimitInterval, concurrentRequests);
		}
	}

	/** Display name of the metadata source, has to be unique. */
	abstract readonly name: string;

	/**
	 * URL pattern used to check supported domains, match entity URLs and extract the ID from the URL.
	 *
	 * The pathname has to contain a named group `id`, e.g. `/release/:id`.
	 * Optionally the pathname can also contain a named group `region` which will be used to extract the preferred region.
	 */
	abstract readonly supportedUrls: URLPattern;

	abstract readonly releaseLookup: ReleaseLookupConstructor;

	/** Country codes of regions in which the provider offers its services (optional). */
	readonly availableRegions?: Set<CountryCode>;

	readonly launchDate: PartialDate = {};

	abstract readonly durationPrecision: DurationPrecision;

	/** Uses the median image height in pixels as the basic metric. */
	abstract readonly artworkQuality: number;

	/** Looks up the release which is identified by the given specifier (URL, GTIN/barcode or provider ID). */
	getRelease(specifier: ReleaseSpecifier, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		const lookup = new this.releaseLookup(this, specifier, options);
		return lookup.getRelease();
	}

	/** Checks whether the provider supports the domain of the given URL. */
	supportsDomain(url: URL): boolean {
		return new URLPattern({ hostname: this.supportedUrls.hostname }).test(url);
	}

	protected snaps: SnapStorage | undefined;

	protected fetch = fetch;

	protected async fetchSnapshot(input: string | URL, options?: CacheOptions): Promise<Snapshot<Response>> {
		let snapshot: Snapshot<Response>;

		if (this.snaps) {
			snapshot = await this.snaps.cache(input, {
				fetch: this.fetch,
				requestInit: options?.requestInit,
				policy: {
					maxAge: 60 * 60 * 24, // 24 hours
					...options?.policy,
				},
			});
		} else {
			snapshot = {
				content: await this.fetch(input, options?.requestInit),
				timestamp: Math.floor(Date.now() / 1000),
				isFresh: true,
				// Dummy data, not relevant in this context.
				contentHash: '',
				path: '',
			};
		}

		return snapshot;
	}

	protected async fetchJSON<Content>(input: string | URL, options?: CacheOptions): Promise<CacheEntry<Content>> {
		const snapshot = await this.fetchSnapshot(input, options);
		const json = await snapshot.content.json();

		return {
			content: json,
			timestamp: snapshot.timestamp,
			isFresh: snapshot.isFresh ?? false,
		};
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
		// Use the provider's generally supported URLs if none have been specified for releases.
		this.supportedUrls ??= provider.supportedUrls;
		// Create a deep copy, we don't want to manipulate the caller's options.
		this.options = { ...options };

		// Intersect preferred regions with available regions (if defined for the provider).
		const availableRegions = this.provider.availableRegions;
		const preferredRegions = Array.from(this.options.regions ?? []);
		if (availableRegions?.size && preferredRegions.length) {
			this.options.regions = new Set(preferredRegions.filter((region) => availableRegions.has(region)));
		}

		this.lookup = { method: 'id', value: '' };
		if (specifier instanceof URL) {
			const id = this.extractReleaseId(specifier);
			if (id === undefined) {
				throw new ProviderError(this.provider.name, `Could not extract ID from ${specifier}`);
			}
			this.lookup.value = id;

			// Prefer region of the given release URL over the standard preferences.
			const region = this.extractReleaseRegion(specifier);
			if (region) {
				this.lookup.region = region;
				this.options.regions = new Set([region]);
			}
		} else if (typeof specifier === 'string') { // ID
			this.lookup.value = specifier;
		} else if (typeof specifier === 'number') { // GTIN
			this.lookup = { method: 'gtin', value: specifier.toString() };
		} else {
			this.lookup = { method: specifier[0], value: specifier[1] };
		}
	}

	/**
	 * URL pattern used to check supported domains, match release URLs and extract the ID from the URL.
	 *
	 * The pathname has to contain a named group `id`, e.g. `/release/:id`.
	 * Optionally the pathname can also contain a named group `region` which will be used to extract the preferred region.
	 *
	 * Falls back to {@linkcode MetadataProvider.supportedUrls} if not specified.
	 */
	protected supportedUrls: URLPattern;

	/** Parameters which are used for the current release lookup. */
	protected lookup: ReleaseLookupParameters;

	/** Release lookup options. */
	protected options: ReleaseOptions;

	/** Provider ID of the currently looked up release (initially undefined). */
	protected id: string | undefined;

	/** Date and time when the (last piece of) provider data was cached (in seconds since the UNIX epoch). */
	protected cacheTime: number | undefined;

	/** Constructs a canonical release URL for the given provider ID (and optional region). */
	abstract constructReleaseUrl(id: string, region?: CountryCode): URL;

	/** Constructs an optional API URL for a release using the specified lookup options. */
	abstract constructReleaseApiUrl(): URL | undefined;

	/** Looks up the release which is identified by the specified URL, GTIN/barcode or provider ID. */
	async getRelease(): Promise<HarmonyRelease> {
		const startTime = performance.now();

		const rawRelease = await this.getRawRelease();
		const release = await this.convertRawRelease(rawRelease);

		// store the elapsed time for each provider info record (just in case), although there should be only one
		const elapsedTime = performance.now() - startTime;
		release.info.providers.forEach((providerInfo) => providerInfo.processingTime = elapsedTime);

		return this.withExcludedRegions(release);
	}

	/**
	 * Loads the raw release data for the specified lookup options.
	 * This method is only used internally and guaranteed to be called with either a GTIN or a provider ID.
	 */
	protected abstract getRawRelease(): Promise<RawRelease>;

	/** Converts the given provider-specific raw release metadata into a common representation. */
	protected abstract convertRawRelease(rawRelease: RawRelease): MaybePromise<HarmonyRelease>;

	/** Extracts the ID from a release URL. */
	extractReleaseId(url: URL): string | undefined {
		return this.supportedUrls.exec(url)?.pathname.groups.id;
	}

	/** Extracts the region from a release URL (if present). */
	extractReleaseRegion(url: URL): CountryCode | undefined {
		// Do not return an empty string in case the group was declared as optional and is missing from the result.
		return this.supportedUrls.exec(url)?.pathname.groups.region?.toUpperCase() || undefined;
	}

	/** Checks whether the provider supports the given URL for releases. */
	supportsReleaseUrl(url: URL): boolean {
		return this.supportedUrls.test(url);
	}

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
		if (!this.id) {
			throw new ProviderError(this.provider.name, 'Release info can only be generated with a defined provider ID');
		}

		return {
			providers: [{
				name: this.provider.name,
				id: this.id,
				url: this.constructReleaseUrl(this.id, this.lookup.region),
				apiUrl: this.constructReleaseApiUrl(),
				lookup: this.lookup,
				cacheTime: this.cacheTime,
			}],
			messages: this.messages,
		};
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

/** Cache entry for a requested piece of data. */
export type CacheEntry<Content> = {
	/** Cached content. */
	content: Content;
	/** Creation date and time in seconds since the UNIX epoch. */
	timestamp: number;
	/** Indicates that the cache entry has been created by the returning method. */
	isFresh: boolean;
	/** Successfully queried region of the API. */
	region?: CountryCode;
};

export enum DurationPrecision {
	SECONDS,
	MS,
	US,
}
