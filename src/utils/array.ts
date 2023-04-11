import { MaybeArray } from './types.ts';

/** Converts a scalar into an array with a single element. */
export function preferArray<T>(maybeArray: MaybeArray<T>): T[] {
	if (!Array.isArray(maybeArray)) return [maybeArray];
	return maybeArray;
}

/** Creates an object from the given arrays of keys and corresponding values. */
export function zipObject<V>(keys: string[], values: V[]): Record<string, V> {
	return Object.fromEntries(keys.map((_, index) => [keys[index], values[index]]));
}
