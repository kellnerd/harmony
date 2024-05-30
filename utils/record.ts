/** Filters the error entires of the given record and creates a new error-free record. */
export function filterErrorEntries<Key extends string, Value>(record: Record<Key, Value | Error>): Record<Key, Value> {
	return Object.fromEntries(
		Object.entries<Value | Error>(record)
			.filter(([_key, value]) => !(value instanceof Error)),
	) as Record<Key, Value>;
}
