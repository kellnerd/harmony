import { CustomError } from 'ts-custom-error';

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
