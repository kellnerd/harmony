import { CustomError } from 'ts-custom-error';

export class ProviderError extends CustomError {
	constructor(readonly providerName: string, message: string) {
		super(`${providerName}: ${message}`);
	}
}

export class ResponseError extends ProviderError {
	constructor(providerName: string, message: string, readonly url: URL) {
		super(providerName, `${message}: ${url}`);
	}
}
