import { ApiError, type EntityWithMbid } from '@kellnerd/musicbrainz';
import type { RelatableEntityType } from '@kellnerd/musicbrainz/data/entity';
import type { ExternalEntityId, HarmonyRelease, ResolvableEntity } from '@/harmonizer/types.ts';
import { MB } from '@/musicbrainz/api_client.ts';
import { constructEntityUrl } from '@/providers/mod.ts';

/** Resolves an external link for a MusicBrainz entity to its MBID. */
export async function resolveToMbid(
	entityIds: ExternalEntityId[],
	entityType: RelatableEntityType,
): Promise<string | undefined> {
	if (!entityIds.length) return;

	// TODO: Make use of multiple external IDs, e.g. prefer cached IDs.
	const primaryEntityId = entityIds[0];
	const externalLink = constructEntityUrl(primaryEntityId);
	try {
		const result = await MB.browseUrl(externalLink, {
			inc: [`${entityType}-rels`],
		});
		const rel = result.relations.find((rel) => rel['target-type'] === entityType);
		if (!rel) return;

		// @ts-ignore: `entityType` is not narrowed, but every specific value is a valid key here.
		const targetEntity = rel[entityType] as EntityWithMbid;
		console.debug('Resolved', entityType, targetEntity.id, externalLink.href);

		return targetEntity.id;
	} catch (error) {
		if (error instanceof ApiError) return;
		throw error;
	}
}

/** Resolves all external links for artists and labels of the given release to their MBIDs. */
export async function resolveReleaseMbids(release: HarmonyRelease) {
	const { artists, labels, media } = release;

	await resolveMbidsForMultipleEntities(artists, 'artist');
	if (labels) {
		await resolveMbidsForMultipleEntities(labels, 'label');
	}
	for (const medium of media) {
		for (const track of medium.tracklist) {
			if (track.artists) {
				await resolveMbidsForMultipleEntities(track.artists, 'artist');
			}
		}
	}
}

async function resolveMbidForEntity(entity: ResolvableEntity, entityType: RelatableEntityType) {
	if (entity.mbid) return;
	if (entity.externalIds) {
		entity.mbid = await resolveToMbid(entity.externalIds, entityType);
	}
}

function resolveMbidsForMultipleEntities(entities: ResolvableEntity[], entityType: RelatableEntityType) {
	return Promise.all(
		entities.map((entity) => resolveMbidForEntity(entity, entityType)),
	);
}
