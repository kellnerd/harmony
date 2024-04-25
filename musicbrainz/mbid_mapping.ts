import { ApiError, type EntityWithMbid } from '@kellnerd/musicbrainz';
import type { RelatableEntityType } from '@kellnerd/musicbrainz/data/entity';
import { MB } from '@/musicbrainz/api_client.ts';

/** Resolves an external link for a MusicBrainz entity to its MBID. */
export async function resolveToMBID(
	externalLink: URL | undefined,
	entityType: RelatableEntityType,
): Promise<string | undefined> {
	if (!externalLink) return;

	try {
		const result = await MB.browseUrl(externalLink, {
			inc: [`${entityType}-rels`],
		});
		const rel = result.relations.find((rel) => rel['target-type'] === entityType);
		if (!rel) return;

		// @ts-ignore: `entityType` is not narrowed, but every specific value is a valid key here.
		const targetEntity = rel[entityType] as EntityWithMbid;

		return targetEntity.id;
	} catch (error) {
		if (error instanceof ApiError) return;
		throw error;
	}
}
