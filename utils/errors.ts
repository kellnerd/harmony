import { CustomError } from 'ts-custom-error';

export class LookupError extends CustomError {}

export class ProviderError extends LookupError {
	constructor(readonly providerName: string, message: string, options?: ErrorOptions) {
		super(message, options);
	}
}

export class ResponseError extends ProviderError {
	constructor(providerName: string, message: string, readonly url: URL) {
		super(providerName, `${message}: ${url}`);
	}
}
