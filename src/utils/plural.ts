/** Returns the given term or its plural form depending on the given count. */
export function plural(count: number, term: string, pluralForm?: string) {
	return (count === 1) ? term : (pluralForm ?? (term + 's'));
}

/** Returns the given term (or its plural form) prefixed by a count. */
export function pluralWithCount(count: number, term: string, pluralForm?: string) {
	return [count, plural(count, term, pluralForm)].join(' ');
}
