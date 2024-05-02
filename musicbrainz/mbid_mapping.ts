import { ApiError, type EntityWithMbid } from '@kellnerd/musicbrainz';
import type { RelatableEntityType } from '@kellnerd/musicbrainz/data/entity';
import type { ExternalEntityId, HarmonyRelease, ResolvableEntity } from '@/harmonizer/types.ts';
import { MB } from '@/musicbrainz/api_client.ts';
import { constructEntityUrl } from '@/providers/mod.ts';

/**
 * Resolves external IDs for a MusicBrainz entity to its MBID.
 *
 * Tries to lookup each of the given external IDs until an MBID is found.
 * Before sending requests to the MusicBrainz API, the MBID cache is checked.
 */
export async function resolveToMbid(
	entityIds: ExternalEntityId[],
	entityType: RelatableEntityType,
): Promise<string | undefined> {
	if (!entityIds.length) return;

	// First check the cache for each entity ID.
	for (const entityId of entityIds) {
		const mbid = getCachedMbid(entityId);
		if (mbid) {
			return mbid;
		}
	}

	// If the MBID is not cached, try to lookup canonical entity URLs with the MB API.
	for (const entityId of entityIds) {
		const externalLink = constructEntityUrl(entityId);
		try {
			const result = await MB.browseUrl(externalLink, {
				inc: [`${entityType}-rels`],
			});
			const rel = result.relations.find((rel) => rel['target-type'] === entityType);
			if (!rel) continue;

			// @ts-ignore: `entityType` is not narrowed, but every specific value is a valid key here.
			const targetEntity = rel[entityType] as EntityWithMbid;
			const mbid = targetEntity.id;
			console.debug('Resolved', entityType, mbid, externalLink.href);
			setCachedMbid(entityId, mbid);

			return mbid;
		} catch (error) {
			if (error instanceof ApiError) continue;
			throw error;
		}
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

// Use session storage or local storage as cache.
const cache = sessionStorage;
const cacheKeySeparator = ':';
const mbidCachePrefix = 'mbid';

function getCachedMbid(entityId: ExternalEntityId): string | undefined {
	const key = [mbidCachePrefix, entityId.provider, entityId.type, entityId.id];
	return cache.getItem(key.join(cacheKeySeparator)) ?? undefined;
}

function setCachedMbid(entityId: ExternalEntityId, mbid: string) {
	const key = [mbidCachePrefix, entityId.provider, entityId.type, entityId.id];
	setCacheItem(key, mbid);
}

function setCacheItem(key: string[], value: string, retries = 1) {
	try {
		cache.setItem(key.join(cacheKeySeparator), value);
	} catch (error) {
		console.debug('Failed to cache item:', error);
		if (retries > 0) {
			deleteRandomCacheItem();
			deleteRandomCacheItem();
			setCacheItem(key, value, retries - 1);
		} else {
			console.warn(`Caching of '${key.join(cacheKeySeparator)}' failed repeatedly`);
		}
	}
}

function deleteRandomCacheItem() {
	if (!cache.length) return;

	const randomIndex = Math.trunc(Math.random() * cache.length);
	const randomKey = cache.key(randomIndex);
	if (randomKey !== null) {
		cache.removeItem(randomKey);
	}
}
