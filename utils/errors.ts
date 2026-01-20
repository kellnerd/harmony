import { CustomError } from 'ts-custom-error';
import type { IncompatibilityInfo } from '@/harmonizer/types.ts';
import { encodeReleaseLookupState } from '@/server/permalink.ts';

/** Replacement for the built-in type which is apparently incompatible with 'ts-custom-error'. */
export type ErrorConstructor = new (...options: ConstructorParameters<typeof Error>) => Error;

/** Something went wrong during a Harmony lookup. */
export class LookupError extends CustomError {}

/** Something went wrong during a lookup using a specific provider. */
export class ProviderError extends LookupError {
	constructor(readonly providerName: string, message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

/** Something is wrong with the response that a specific provider received for an HTTP (API) request. */
export class ResponseError extends ProviderError {
	constructor(providerName: string, message: string, readonly url: URL) {
		super(providerName, `${message}: ${url}`);
	}
}

/** No matching snapshot was found in the cache. */
export class CacheMissError extends CustomError {}

/**
 * Different providers have returned incompatible data.
 */
export class CompatibilityError extends LookupError {
	constructor(message: string, readonly incompatibility: IncompatibilityInfo) {
		super(message);
	}

	get details() {
		return this.incompatibility.clusters.map((cluster) =>
			`${cluster.incompatibleValue} (${cluster.providers.map(({ name }) => name).join(', ')})`
		);
	}

	/** Generates a markdown (lookup) link for each incompatible cluster. */
	makeAlternativeLinks(currentUrl: URL) {
		return this.incompatibility.clusters.map((cluster) => {
			const clusterLookup = encodeReleaseLookupState({
				providers: cluster.providers,
				messages: [],
			}, {
				permalink: false,
				preferUrlFor: 'all',
			});

			return `[${cluster.incompatibleValue}](${currentUrl.pathname}?${clusterLookup}) (${
				cluster.providers.map((provider) => provider.name).join(', ')
			})`;
		});
	}
}
