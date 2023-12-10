import { ProviderError } from '../utils/errors.ts';
import { rateLimit } from 'utils/async/rateLimit.js';

import type {
	CountryCode,
	GTIN,
	HarmonyRelease,
	MessageType,
	ProviderMessage,
	RawReleaseOptions,
	RawResult,
	ReleaseInfo,
	ReleaseLookupInfo,
	ReleaseOptions,
} from '../harmonizer/types.ts';
import type { PartialDate } from '../utils/date.ts';
import type { SnapStorage } from 'snap-storage';
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
export abstract class MetadataProvider<RawRelease> {
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

	/** Display name of the metadata source. */
	abstract readonly name: string;

	/**
	 * URL pattern used to check supported domains, match release URLs and extract the ID from the URL.
	 * The pathname has to contain a named group `id`, e.g. `/release/:id`.
	 * Optionally the pathname can also contain a named group `region` which will be used to extract the preferred region.
	 */
	abstract readonly supportedUrls: URLPattern;

	abstract readonly releaseLookup: ReleaseLookupConstructor<RawRelease>;

	/** Country codes of regions in which the provider offers its services (optional). */
	readonly availableRegions: CountryCode[] = [];

	readonly launchDate: PartialDate = {};

	abstract readonly durationPrecision: DurationPrecision;

	/** Uses the median image height in pixels as the basic metric. */
	abstract readonly artworkQuality: number;

	/** Looks up the release which is identified by the given URL, GTIN/barcode or provider ID. */
	getRelease(urlOrGtinOrId: URL | GTIN | string, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		const lookup = new this.releaseLookup(this, urlOrGtinOrId, options);
		return lookup.getRelease(urlOrGtinOrId, options);
	}

	/** Checks whether the provider supports the domain of the given URL. */
	supportsDomain(url: URL): boolean {
		return new URLPattern({ hostname: this.supportedUrls.hostname }).test(url);
	}

	generateMessage(text: string, type: MessageType = 'info'): ProviderMessage {
		return {
			provider: this.name,
			text,
			type,
		};
	}

	protected snaps: SnapStorage | undefined;

	protected fetch = fetch;

	protected async fetchJSON(input: string | URL, init?: RequestInit) {
		let response: Response;

		if (this.snaps) {
			const snap = await this.snaps.cache(input, {
				fetch: this.fetch,
				requestInit: init,
				policy: {
					maxAge: 60 * 60 * 24, // 24 hours
				},
			});
			response = snap.content;
			console.debug(snap.isFresh ? 'Fetched' : 'Cached', new Date(snap.timestamp * 1000), input.toString());
		} else {
			response = await this.fetch(input, init);
			console.debug('Fetched:', input.toString());
		}

		return response.json();
	}
}

type AnyProvider = MetadataProvider<unknown>;

export type ExtractRelease<Provider extends AnyProvider> = Provider extends MetadataProvider<infer Release> ? Release : never;

// TODO: The following type with ctor params causes issues because provider subclasses have additional methods.
// type ReleaseLookupConstructor<Provider extends AnyProvider> = new (...args: ConstructorParameters<typeof ReleaseLookup<Provider>>) => ReleaseLookup<Provider>;
type ReleaseLookupConstructor<RawRelease> = new (...args: any[]) => ReleaseLookup<MetadataProvider<RawRelease>>;

export abstract class ReleaseLookup<Provider extends AnyProvider, RawRelease = ExtractRelease<Provider>> {
	constructor(
		protected provider: Provider,
		urlOrGtinOrId: URL | GTIN | string,
		options: ReleaseOptions = {},
	) {
		// Use the provider's generally supported URLs if none have been specified for releases.
		this.supportedUrls ??= provider.supportedUrls;
	}

	/**
	 * URL pattern used to check supported domains, match release URLs and extract the ID from the URL.
	 * The pathname has to contain a named group `id`, e.g. `/release/:id`.
	 * Optionally the pathname can also contain a named group `region` which will be used to extract the preferred region.
	 */
	protected supportedUrls: URLPattern;

	/** Constructs a canonical release URL for the given provider ID (and optional region). */
	abstract constructReleaseUrl(id: string, region?: CountryCode): URL;

	/** Constructs an optional API URL for a release using the given data. */
	abstract constructReleaseApiUrl(options: RawReleaseOptions): URL | undefined;

	/** Looks up the release which is identified by the given URL, GTIN/barcode or provider ID. */
	getRelease(urlOrGtinOrId: URL | GTIN | string, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		if (urlOrGtinOrId instanceof URL) {
			const id = this.extractReleaseId(urlOrGtinOrId);
			if (id === undefined) {
				throw new ProviderError(this.provider.name, `Could not extract ID from ${urlOrGtinOrId}`);
			}

			// prefer region of the given release URL over the standard preferences
			const region = this.extractReleaseRegion(urlOrGtinOrId);
			if (region) {
				// create a deep copy, we don't want to manipulate the caller's options
				options = { ...options };
				options.regions = [region];
			}

			return this.getReleaseById(id, options);
		} else if (typeof urlOrGtinOrId === 'string' && !/^\d{12,14}$/.test(urlOrGtinOrId)) {
			return this.getReleaseById(urlOrGtinOrId, options);
		} else { // number or string with 12 to 14 digits, most likely a GTIN
			return this.getReleaseByGTIN(urlOrGtinOrId, options);
		}
	}

	/** Looks up the release which is identified by the given provider ID. */
	getReleaseById(id: string, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		const rawOptions = options as RawReleaseOptions;
		rawOptions.lookup = { method: 'id', value: id };

		return this.processReleaseLookup(rawOptions);
	}

	/** Looks up the release which is identified by the given GTIN/barcode. */
	getReleaseByGTIN(gtin: GTIN, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		const rawOptions = options as RawReleaseOptions;
		rawOptions.lookup = { method: 'gtin', value: gtin.toString() };

		return this.processReleaseLookup(rawOptions);
	}

	private async processReleaseLookup(rawOptions: RawReleaseOptions): Promise<HarmonyRelease> {
		const startTime = performance.now();

		const rawRelease = await this.getRawRelease(rawOptions);
		const release = await this.convertRawRelease(rawRelease, rawOptions);

		// store the elapsed time for each provider info record (just in case), although there should be only one
		const elapsedTime = performance.now() - startTime;
		release.info.providers.forEach((providerInfo) => providerInfo.processingTime = elapsedTime);

		return this.withExcludedRegions(release);
	}

	/**
	 * Loads the raw release data for the given lookup options.
	 * This method is only used internally and guaranteed to be called with either a GTIN or a provider ID.
	 */
	protected abstract getRawRelease(options: RawReleaseOptions): Promise<RawResult<RawRelease>>;

	/** Converts the given provider-specific raw release metadata into a common representation. */
	protected abstract convertRawRelease(
		rawResult: RawResult<RawRelease>,
		options: RawReleaseOptions,
	): MaybePromise<HarmonyRelease>;

	/** Extracts the ID from a release URL. */
	extractReleaseId(url: URL): string | undefined {
		return this.supportedUrls.exec(url)?.pathname.groups.id;
	}

	/** Extracts the region from a release URL (if present). */
	extractReleaseRegion(url: URL): CountryCode | undefined {
		// do not return an empty string in case the group was declared as optional and is missing from the result
		return this.supportedUrls.exec(url)?.pathname.groups.region || undefined;
	}

	/** Checks whether the provider supports the given URL for releases. */
	supportsReleaseUrl(url: URL): boolean {
		return this.supportedUrls.test(url);
	}

	protected generateReleaseInfo({ id, lookupInfo, messages = [], options }: {
		id: string;
		lookupInfo: ReleaseLookupInfo;
		messages?: ProviderMessage[];
		options: RawReleaseOptions;
	}): ReleaseInfo {
		// overwrite optional property with the actually used region (in order to build the accurate API URL)
		options.lookup.region = lookupInfo.region;

		return {
			providers: [{
				name: this.provider.name,
				id,
				region: lookupInfo.region,
				url: this.constructReleaseUrl(id, lookupInfo.region),
				apiUrl: this.constructReleaseApiUrl(options),
			}],
			messages,
		};
	}

	/** Determines excluded regions of the release (if available regions have been specified for the provider). */
	private withExcludedRegions(release: HarmonyRelease): HarmonyRelease {
		const availableRegions = this.provider.availableRegions;
		if (availableRegions.length && release.availableIn) {
			if (release.availableIn.length) {
				const releaseAvailability = new Set(release.availableIn);
				release.excludedFrom = availableRegions.filter((region) => !releaseAvailability.has(region));
			} else {
				release.excludedFrom = [...availableRegions];
			}
		}

		return release;
	}
}

export enum DurationPrecision {
	SECONDS,
	MS,
	US,
}
