import { ProviderError } from '../utils/errors.ts';
import { rateLimit } from 'utils/async/rateLimit.js';

import type { GTIN, HarmonyRelease, ReleaseOptions } from '../harmonizer/types.ts';
import type { MaybePromise } from 'utils/types.d.ts';

export type ProviderOptions = Partial<{
	/** Duration of one rate-limiting interval for requests (in ms). */
	rateLimitInterval: number | null;
	/** Maximum number of requests within the interval. */
	concurrentRequests: number;
}>;

/**
 * Abstract metadata provider which looks up releases from a specific source.
 * Converts the raw metadata into a common representation.
 */
export abstract class MetadataProvider<RawRelease> {
	constructor({
		rateLimitInterval = null,
		concurrentRequests = 1,
	}: ProviderOptions = {}) {
		if (rateLimitInterval && rateLimitInterval > 0) {
			this.fetch = rateLimit(fetch, rateLimitInterval, concurrentRequests);
		}
	}

	/** Display name of the metadata source. */
	abstract readonly name: string;

	/**
	 * URL pattern used to check supported domains, match release URLs and extract the ID from the URL.
	 * The pathname has to contain a named group `id`, e.g. `/release/:id`.
	 */
	abstract readonly supportedUrls: URLPattern;

	abstract readonly durationPrecision: DurationPrecision;

	/** Constructs a canonical release URL for the given provider ID. */
	abstract constructReleaseUrl(id: string): URL;

	/** Looks up the release which is identified by the given URL, GTIN/barcode or provider ID. */
	getRelease(urlOrGtinOrId: URL | GTIN | string, options?: ReleaseOptions): Promise<HarmonyRelease> {
		if (urlOrGtinOrId instanceof URL) {
			const id = this.extractReleaseId(urlOrGtinOrId);
			if (id === undefined) {
				throw new ProviderError(this.name, `Could not extract ID from ${urlOrGtinOrId}`);
			}
			return this.getReleaseById(id, options);
		} else if (typeof urlOrGtinOrId === 'string' && !/^\d{12,14}$/.test(urlOrGtinOrId)) {
			return this.getReleaseById(urlOrGtinOrId, options);
		} else { // number or string with 12 to 14 digits, most likely a GTIN
			return this.getReleaseByGTIN(urlOrGtinOrId, options);
		}
	}

	/** Looks up the release which is identified by the given provider ID. */
	async getReleaseById(id: string, options?: ReleaseOptions): Promise<HarmonyRelease> {
		return this.convertRawRelease(await this.getRawReleaseById(id), options);
	}

	protected abstract getRawReleaseById(id: string): Promise<RawRelease>;

	/** Looks up the release which is identified by the given GTIN/barcode. */
	async getReleaseByGTIN(gtin: GTIN, options?: ReleaseOptions): Promise<HarmonyRelease> {
		return this.convertRawRelease(await this.getRawReleaseByGTIN(gtin), options);
	}

	protected abstract getRawReleaseByGTIN(gtin: GTIN): Promise<RawRelease>;

	/** Converts the given provider-specific raw release metadata into a common representation. */
	protected abstract convertRawRelease(rawRelease: RawRelease, options?: ReleaseOptions): MaybePromise<HarmonyRelease>;

	/** Extracts the ID from a release URL. */
	extractReleaseId(url: URL): string | undefined {
		return this.supportedUrls.exec(url)?.pathname.groups.id;
	}

	/** Checks whether the provider supports the domain of the given URL. */
	supportsDomain(url: URL): boolean {
		return new URLPattern({ hostname: this.supportedUrls.hostname }).test(url);
	}

	/** Checks whether the provider supports the given URL for releases. */
	supportsReleaseUrl(url: URL): boolean {
		return this.supportedUrls.test(url);
	}

	protected fetch = fetch;

	protected async fetchJSON(input: RequestInfo | URL, init?: RequestInit) {
		const response = await this.fetch(input, init);
		return response.json();
	}
}

export enum DurationPrecision {
	SECONDS,
	MS,
	US,
}