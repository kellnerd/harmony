export function isDefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}

export function isNotEmpty(value: string): boolean {
	return value !== '';
}

export function isNotError<T>(value: T | Error): value is T {
	return !(value instanceof Error);
}
