import { simplifyName } from 'utils/string/simplify.js';

/** Checks whether the simplified versions of the given names are identical. */
export function similarNames(a: string, b: string): boolean {
	return simplifyName(a) === simplifyName(b);
}
