import { type EntityType, entityTypes } from '@kellnerd/musicbrainz/data/entity';
import { assert } from 'std/assert/assert.ts';
import { validate } from '@std/uuid/v4';

const MBID_LENGTH = 36;

/**
 * Extracts an MBID from the given input.
 *
 * If the input is an URL, the entity type will be validated against the allowed types (which default to all types).
 */
export function extractMBID(input: string, allowedTypes: readonly EntityType[] = entityTypes): string {
	input = input.trim();
	if (input.length === MBID_LENGTH) {
		assert(validate(input), `"${input}" is not a valid MBID`);
		return input;
	} else {
		const entityUrlPattern = new RegExp(`(${allowedTypes.join('|')})/([0-9a-f-]{36})(?:$|/|\\?)`);
		const entity = input.match(entityUrlPattern);
		assert(entity, `"${input}" does not contain a valid ${allowedTypes.join('/')} MBID`);
		return entity[2];
	}
}
