import { FormDataRecord, Key } from './types.ts';

/**
 * Flattens the given (deep) object to a single level hierarchy.
 * Concatenates the keys in a nested structure which lead to a value with dots.
 * @param preservedKeys Keys whose values will be preserved.
 */
export function flatten(object: any, preservedKeys: Key[] = []): FormDataRecord {
	const flatObject: FormDataRecord = {};

	for (const key in object) {
		let value = object[key];
		if (typeof value === 'object' && value !== null && !preservedKeys.includes(key)) { // also matches arrays
			value = flatten(value, preservedKeys);
			for (const childKey in value) {
				flatObject[key + '.' + childKey] = value[childKey]; // concatenate keys
			}
		} else { // value is already flat (e.g. a string) or should be preserved
			flatObject[key] = value; // keep the key
		}
	}

	return flatObject;
}
