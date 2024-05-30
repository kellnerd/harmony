/** Filters the error entires of the given record and creates a new error-free record. */
export function filterErrorEntries<Key extends string, Value>(record: Record<Key, Value | Error>): Record<Key, Value> {
	return Object.fromEntries(
		Object.entries<Value | Error>(record)
			.filter(([_key, value]) => !(value instanceof Error)),
	) as Record<Key, Value>;
}

/** Maps the entries of the given record to pairs of the original key and a mapped value. */
export function mapEntryValues<Key extends string, Value, Result>(
	record: Record<Key, Value>,
	mapper: (value: Value, index?: number) => Result,
): [Key, Result][] {
	return Object.entries<Value>(record)
		.map(([key, value], index) => [key as Key, mapper(value, index)]);
}
