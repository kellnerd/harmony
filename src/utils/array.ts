import { MaybeArray } from './types';

/** Converts a scalar into an array with a single element. */
export function preferArray<T>(maybeArray: MaybeArray<T>): T[] {
	if (!Array.isArray(maybeArray)) return [maybeArray];
	return maybeArray;
}
