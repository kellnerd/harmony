import { ProviderError } from '../errors.ts';

import type { DurationPrecision, GTIN, HarmonyRelease, ReleaseOptions } from './common.ts';
import type { MaybePromise } from '../utils/types.ts';

/**
 * Abstract metadata provider which looks up releases from a specific source.
 * Converts the raw metadata into a common representation.
 */
export default abstract class MetadataProvider<RawRelease> {
	/** Display name of the metadata source. */
	abstract readonly name: string;

	/**
	 * URL pattern used to check supported domains, match release URLs and extract the ID from the URL.
	 * The pathname has to contain a named group `id`, e.g. `/release/:id`.
	 */
	abstract readonly supportedUrls: URLPattern;

	abstract readonly durationPrecision: DurationPrecision;

	/** Looks up the release which is identified by the given URL or GTIN/barcode. */
	getRelease(urlOrGtin: URL | GTIN, options?: ReleaseOptions): Promise<HarmonyRelease> {
		if (urlOrGtin instanceof URL) {
			const id = this.extractReleaseId(urlOrGtin);
			if (id === undefined) {
				throw new ProviderError(this.name, `Could not extract ID from ${urlOrGtin}`);
			}
			return this.getReleaseById(id, options);
		} else {
			return this.getReleaseByGTIN(urlOrGtin, options);
		}
	}

	/** Looks up the release which is identified by the given provider ID. */
	async getReleaseById(id: string, options?: ReleaseOptions): Promise<HarmonyRelease> {
		return this.convertRawRelease(await this.getRawReleaseById(id), options);
	}

	abstract getRawReleaseById(id: string): Promise<RawRelease>;

	/** Looks up the release which is identified by the given GTIN/barcode. */
	async getReleaseByGTIN(gtin: GTIN, options?: ReleaseOptions): Promise<HarmonyRelease> {
		return this.convertRawRelease(await this.getRawReleaseByGTIN(gtin), options);
	}

	abstract getRawReleaseByGTIN(gtin: GTIN): Promise<RawRelease>;

	/** Converts the given provider-specific raw release metadata into a common representation. */
	abstract convertRawRelease(rawRelease: RawRelease, options?: ReleaseOptions): MaybePromise<HarmonyRelease>;

	/** Constructs a canonical release URL for the given provider ID. */
	abstract constructReleaseUrl(id: string): URL;

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

	protected async fetchJSON(input: RequestInfo | URL, init?: RequestInit) {
		const response = await fetch(input, init);
		return response.json();
	}
}
