import { Label } from '@/harmonizer/types.ts';

/**
 * Split label string using slashes if the results have at least 3 characters.
 *
 * @param labels String containing one or more label name.
 * @returns List of `Label` entries
 */
export function splitLabels(labels: string): Label[] {
	return labels?.split(/(?<=[^/]{3,})\/(?=[^/]{3,})/).map((label) => ({
		name: label.trim(),
	}));
}
