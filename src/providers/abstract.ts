import { ProviderError } from '../errors';
import { preferArray } from '../utils/array';

import type { GTIN, HarmonyRelease } from './common';
import type { MaybeArray, MaybePromise } from '../utils/types';

/**
 * Abstract metadata provider which looks up releases from a specific source.
 * Converts the raw metadata into a common representation.
 */
export default abstract class MetadataProvider<RawRelease> {
	/** Display name of the metadata source. */
	abstract readonly name: string;

	/**
	 * Regular expression or host string used to match supported domains.
	 * Matched against the host (hostname and port) of the URL.
	 */
	abstract readonly supportedDomains: MaybeArray<RegExp | string>;

	/**
	 * Regular expression used to match supported release URLs and extract the ID from the URL.
	 * Matched against the clean URL as returned by `cleanUrl()`.
	 */
	abstract readonly releaseUrlRegex: MaybeArray<RegExp>;

	/** Looks up the release which is identified by the given URL or GTIN/barcode. */
	getRelease(urlOrGtin: URL | GTIN): Promise<HarmonyRelease> {
		if (urlOrGtin instanceof URL) {
			const id = this.extractReleaseId(urlOrGtin);
			if (id === undefined) {
				throw new ProviderError(this.name, `Could not extract ID from ${urlOrGtin}`);
			}
			return this.getReleaseById(id);
		} else {
			return this.getReleaseByGTIN(urlOrGtin);
		}
	};

	/** Looks up the release which is identified by the given provider ID. */
	async getReleaseById(id: string): Promise<HarmonyRelease> {
		return this.convertRawRelease(await this.getRawReleaseById(id));
	};

	abstract getRawReleaseById(id: string): Promise<RawRelease>;

	/** Looks up the release which is identified by the given GTIN/barcode. */
	async getReleaseByGTIN(gtin: GTIN): Promise<HarmonyRelease> {
		return this.convertRawRelease(await this.getRawReleaseByGTIN(gtin));
	};

	abstract getRawReleaseByGTIN(gtin: GTIN): Promise<RawRelease>;

	/** Converts the given provider-specific raw release metadata into a common representation. */
	abstract convertRawRelease(rawRelease: RawRelease): MaybePromise<HarmonyRelease>;

	/** Constructs a canonical release URL for the given provider ID. */
	abstract constructReleaseUrl(id: string): URL;

	/** Extracts the ID from a release URL. */
	extractReleaseId(url: URL): string | undefined {
		if (!this.supportsDomain(url)) {
			throw new ProviderError(this.name, `Unsupported domain: ${url}`);
		};

		const cleanUrl = this.cleanUrl(url);

		if (!Array.isArray(this.releaseUrlRegex)) {
			return cleanUrl.match(this.releaseUrlRegex)?.[1];
		} else {
			return this.releaseUrlRegex
				.map((regex) => cleanUrl.match(regex)?.[1])
				.find((id) => id !== undefined);
		}
	}

	/** Checks whether the provider supports the domain of the given URL. */
	supportsDomain(url: URL): boolean {
		return preferArray(this.supportedDomains).some((domain) => {
			if (typeof domain === 'string') return domain === url.host;
			else return domain.test(url.host);
		});
	}

	/** Checks whether the provider supports the given URL for releases. */
	supportsReleaseUrl(url: URL): boolean {
		const cleanUrl = this.cleanUrl(url);
		if (!Array.isArray(this.releaseUrlRegex)) {
			return this.releaseUrlRegex.test(cleanUrl);
		} else {
			return this.releaseUrlRegex.some((regex) => regex.test(cleanUrl));
		}
	}

	/** Returns a clean version of the given URL. This version will be used to match against `urlRegex`. */
	protected cleanUrl(url: URL): string {
		return url.host + url.pathname;
	}

	protected async fetchJSON(input: RequestInfo | URL, init?: RequestInit) {
		const response = await fetch(input, init);
		return response.json();
	}
}
