import { CustomError } from 'ts-custom-error';

export class ProviderError extends CustomError {
	constructor(readonly providerName: string, message: string) {
		super(message);
	}
}

export class ResponseError extends ProviderError {
	constructor(providerName: string, message: string) {
		super(providerName, `No valid response: ${message}`);
	}
}
