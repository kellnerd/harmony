import { CustomError } from 'ts-custom-error';
import type { ProviderName } from '@/harmonizer/types.ts';

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
export class CompatibilityError<Value extends string | number> extends CustomError {
	/** Pairs of incompatible value and the names of the providers which returned that value. */
	readonly valuesAndSources: [Value, ProviderName[]][];

	constructor(message: string, valuesAndSources: [Value, ProviderName[]][]) {
		super(message);
		this.valuesAndSources = valuesAndSources;
	}

	messageWithDetails() { // TODO: rename to `toString`?
		return `${this.message}: ${
			this.valuesAndSources.map(
				([value, providerNames]) => `${value} (${providerNames.join(', ')})`,
			).join(', ')
		}`;
	}
}
