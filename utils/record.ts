/** Clones properties between records of the same type. Creates a deep copy if necessary. */
export function cloneInto<T>(target: T, source: T, property: keyof T) {
	let value = source[property];
	if (value === undefined) {
		return value;
	}
	if (typeof value === 'object' && value !== null) {
		value = structuredClone(value);
	}
	return target[property] = value;
}

/** Copies properties between records of the same type. Helper to prevent type errors. */
export function copyTo<T>(target: T, source: T, property: keyof T) {
	const value = source[property];
	if (value === undefined) {
		return value;
	}
	return target[property] = value;
}

/** Filters the error entries of the given record and creates a new error-free record. */
export function filterErrorEntries<Key extends string, Value>(record: Record<Key, Value | Error>): Record<Key, Value> {
	return Object.fromEntries(
		Object.entries<Value | Error>(record)
			.filter(([_key, value]) => !(value instanceof Error)),
	) as Record<Key, Value>;
}

/** Checks whether the given value is an empty object (or array). */
export function isEmptyObject(value: unknown): boolean {
	return typeof value === 'object' && value !== null && Object.keys(value).length === 0;
}

export function isFilled(value: unknown): boolean {
	return value !== undefined && !isEmptyObject(value);
}

/** Maps the entries of the given record to pairs of the original key and a mapped value. */
export function mapEntryValues<Key extends string, Value, Result>(
	record: Record<Key, Value>,
	mapper: (value: Value, index?: number) => Result,
): [Key, Result][] {
	return Object.entries<Value>(record)
		.map(([key, value], index) => [key as Key, mapper(value, index)]);
}

/** Creates a new record from the keys and the mapped values of the given record. */
export function mapValues<Key extends string, Value, Result>(
	record: Record<Key, Value>,
	mapper: (value: Value, index?: number) => Result,
): Record<Key, Result> {
	return Object.fromEntries(mapEntryValues(record, mapper)) as Record<Key, Result>;
}

/**
 * Returns pairs of unique mapped values and keys which use this value.
 *
 * Mapped values are converted to string identifiers before comparison.
 */
export function uniqueMappedValues<Key extends string, Value, Result>(
	record: Record<Key, Value>,
	mapper: (value: Value) => Result | null | undefined,
	makeIdentifier?: (value: Result) => string,
): Array<[Result, Key[]]> {
	const uniqueValuesByIdentifier = new Map<string, Result>();
	const keysByIdentifier = new Map<string, Key[]>();

	for (const [key, value] of mapEntryValues(record, mapper)) {
		if (value === null || value === undefined) continue;

		const identifier = makeIdentifier ? makeIdentifier(value) : value.toString();
		const knownKeys = keysByIdentifier.get(identifier);
		if (knownKeys) {
			knownKeys.push(key);
		} else {
			keysByIdentifier.set(identifier, [key]);
			uniqueValuesByIdentifier.set(identifier, value);
		}
	}

	const result: Array<[Result, Key[]]> = [];
	for (const [key, value] of uniqueValuesByIdentifier) {
		result.push([value, keysByIdentifier.get(key)!]);
	}

	return result;
}
