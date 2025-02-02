import { simplifyName } from 'utils/string/simplify.js';

/** Checks whether the simplified versions of the given names are identical. */
export function similarNames(a: string, b: string): boolean {
	return simplifyName(a) === simplifyName(b);
}

/**
 * Finds the candidate item whose name matches the name of the main item.
 *
 * Uses the same name similarity algorithm as {@linkcode similarNames}.
 */
export function matchBySimilarName<T>(
	mainItem: T,
	candidates: T[],
	getName: (item: T) => string | undefined,
): T | undefined {
	const mainName = getName(mainItem);
	if (!mainName) return;

	const simplifiedMainName = simplifyName(mainName);

	return candidates.find((candidate) => {
		const candidateName = getName(candidate);
		if (!candidateName) return false;

		return simplifyName(candidateName) === simplifiedMainName;
	});
}
