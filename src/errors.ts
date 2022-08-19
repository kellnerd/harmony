import { CustomError } from 'ts-custom-error';

export class ProviderError extends CustomError {
	providerName: string;

	constructor(providerName: string, message: string) {
		super(message);
		this.providerName = providerName;
	}
}

export class ResponseError extends ProviderError {
	constructor(providerName: string, message: string) {
		super(providerName, `No valid response: ${message}`);
	}
}
