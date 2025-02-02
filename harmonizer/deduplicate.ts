import { ResolvableEntity } from '@/harmonizer/types.ts';

/** Deduplicates the given entities based on MBID and name. */
export function deduplicateEntities<T extends ResolvableEntity>(entities: Iterable<T>): T[] {
	const result: T[] = [];
	const mbids = new Set<string>();
	const names = new Set<string>();

	for (const entity of entities) {
		const { name, mbid } = entity;
		if (mbid) {
			if (!mbids.has(mbid)) {
				result.push(entity);
				mbids.add(mbid);
			}
		} else if (name) {
			if (!names.has(name)) {
				result.push(entity);
				names.add(name);
			}
		}
	}

	return result;
}
