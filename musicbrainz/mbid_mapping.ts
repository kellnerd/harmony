import { ApiError, type EntityWithMbid } from '@kellnerd/musicbrainz';
import type { RelatableEntityType } from '@kellnerd/musicbrainz/data/entity';
import type { HarmonyRelease, ResolvableEntity } from '@/harmonizer/types.ts';
import { MB } from '@/musicbrainz/api_client.ts';

/** Resolves an external link for a MusicBrainz entity to its MBID. */
export async function resolveToMbid(
	externalLink: URL,
	entityType: RelatableEntityType,
): Promise<string | undefined> {
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
	if (entity.externalLink) {
		entity.mbid = await resolveToMbid(entity.externalLink, entityType);
		console.debug('Resolved', entityType, entity.mbid, entity.externalLink.href);
	}
}

function resolveMbidsForMultipleEntities(entities: ResolvableEntity[], entityType: RelatableEntityType) {
	return Promise.all(
		entities.map((entity) => resolveMbidForEntity(entity, entityType)),
	);
}
