export function isDefined<T>(value: T | undefined): value is T {
	return value !== undefined;
}

export function isNotError<T>(value: T | Error): value is T {
	return !(value instanceof Error);
}
