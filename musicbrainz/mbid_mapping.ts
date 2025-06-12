import { inDevMode } from '@/config.ts';
import type { ExternalEntityId, HarmonyRelease, ResolvableEntity } from '@/harmonizer/types.ts';
import { MB } from '@/musicbrainz/api_client.ts';
import { providers } from '@/providers/mod.ts';
import { encodeReleaseLookupState } from '@/server/permalink.ts';
import { pluralWithCount } from '@/utils/plural.ts';
import { isDefined } from '@/utils/predicate.ts';
import { type EntityWithMbid, RateLimitError } from '@kellnerd/musicbrainz';
import type { RelInclude } from '@kellnerd/musicbrainz/api-types';
import type { RelatableEntityType } from '@kellnerd/musicbrainz/data/entity';
import { assert } from 'std/assert/assert.ts';
import { chunk } from '@std/collections/chunk';
import { getLogger } from 'std/log/get_logger.ts';

/**
 * Resolves the external IDs of each given MusicBrainz entity to its MBID.
 *
 * Tries to lookup the URL form of the given external IDs until an MBID is found.
 * Before sending any requests to the MusicBrainz API, the MBID cache is checked.
 */
export async function resolveMbids(
	entities: Iterable<ResolvableEntity>,
	entityTypes: RelatableEntityType[] = ['artist', 'label'],
): Promise<MbidResolverStatistics> {
	const { serializedExternalIdToMbid, uncachedEntityUrls } = collectCachedExternalIdToMbidMapping(entities);

	let lookedUpMbids = 0, lookedUpUrls = 0, resolvedMbids = 0, requests = 0;
	if (uncachedEntityUrls.length) {
		// TODO: Prioritize URL lookups if more than one request would be necessary:
		// Begin with looking up the first N external IDs of each entity, only lookup the rest if still necessary.

		for (const urlsToBeLookedUp of chunk(uncachedEntityUrls, MAX_URLS_PER_REQUEST)) {
			lookedUpMbids += await lookupUrlToMbidMapping(urlsToBeLookedUp, serializedExternalIdToMbid, entityTypes);
			lookedUpUrls += urlsToBeLookedUp.length;
			requests++;
		}
	}

	// Inject collected MBIDs into the resolvable entities.
	for (const entity of entities) {
		if (!entity.mbid && entity.externalIds?.length) {
			// Try all external IDs until one can be resolved to an MBID.
			for (const externalId of entity.externalIds) {
				const mbid = serializedExternalIdToMbid.get(serializeExternalId(externalId));
				if (mbid) {
					entity.mbid = mbid;
					resolvedMbids++;
					break;
				}
			}
		}
	}

	return {
		lookedUpMbids,
		lookedUpUrls,
		resolvedMbids,
		requests,
	};
}

/** Statistics collected by the MBID resolver. */
interface MbidResolverStatistics {
	lookedUpUrls: number;
	lookedUpMbids: number;
	resolvedMbids: number;
	requests: number;
}

/**
 * Collects already cached MBIDs for the external IDs of the given entities.
 *
 * Returns a mapping from serialized external ID to MBID and an array of URLs corresponding to uncached IDs.
 */
function collectCachedExternalIdToMbidMapping(entities: Iterable<ResolvableEntity>): {
	serializedExternalIdToMbid: Map<string, string>;
	uncachedEntityUrls: URL[];
} {
	const log = getLogger('harmony.mbid');

	// Collect external IDs of entities without MBID and deduplicate them (using a serialized string key).
	// Remember the (first) entity to which each processed external ID belongs.
	const externalIdsByIdKey = new Map<string, ExternalEntityId>();
	const entitiesByIdKey = new Map<string, ResolvableEntity>();
	let entityCount = 0;
	for (const entity of entities) {
		if (!entity.mbid && entity.externalIds?.length) {
			entityCount++;
			for (const externalId of entity.externalIds) {
				const idKey = serializeExternalId(externalId);
				if (!externalIdsByIdKey.has(idKey)) {
					externalIdsByIdKey.set(idKey, externalId);
					entitiesByIdKey.set(idKey, entity);
				}
			}
		}
	}

	// Load cached MBIDs and collect the remaining unmapped external IDs.
	const mbidByIdKey = new Map<string, string>();
	const unmappedIdsByIdKey = new Map<string, ExternalEntityId>();
	for (const [idKey, externalId] of externalIdsByIdKey) {
		const mbid = getCachedMbid(externalId);
		if (mbid) {
			mbidByIdKey.set(idKey, mbid);
		} else {
			unmappedIdsByIdKey.set(idKey, externalId);
		}
	}

	// Construct URLs that have to be looked up on MusicBrainz to resolve them to MBIDs.
	// Ignore external IDs/links that belong to entities for which we already know the MBID (via another ID).
	const uncachedEntityUrls = new Array<URL>();
	for (const [idKey, externalId] of unmappedIdsByIdKey) {
		const entity = entitiesByIdKey.get(idKey)!;
		const hasKnownMbid = entity.externalIds?.some((otherId) => mbidByIdKey.has(serializeExternalId(otherId)));
		if (!hasKnownMbid) {
			uncachedEntityUrls.push(providers.constructEntityUrl(externalId));
		}
	}

	log.debug(() =>
		`Collected ${entityCount} resolvable entities with ${externalIdsByIdKey.size} unique external IDs` +
		` (${unmappedIdsByIdKey.size} uncached IDs, ${uncachedEntityUrls.length} URLs have to be looked up)`
	);

	return { serializedExternalIdToMbid: mbidByIdKey, uncachedEntityUrls };
}

/** Maximum number of URLs which can be looked up with a single MB API request. */
const MAX_URLS_PER_REQUEST = 100;

/**
 * Looks up (uncached) entity URLs using the MusicBrainz API.
 *
 * Collects the resulting MBIDs and updates the given mapping and the MBID cache.
 */
async function lookupUrlToMbidMapping(
	entityUrls: URL[],
	serializedExternalIdToMbid: Map<string, string>,
	entityTypes: RelatableEntityType[],
) {
	if (!entityUrls.length) return 0;
	assert(entityUrls.length <= MAX_URLS_PER_REQUEST, 'Too many URLs for one API request');

	const log = getLogger('harmony.mbid');
	// Handle API inconsistency, target types are in snake case.
	const expectedTargetTypes = new Set(entityTypes.map((type) => type.replaceAll('-', '_')));

	const results = await MB.lookupByUrl(entityUrls, {
		inc: entityTypes.map((entityType) => `${entityType}-rels` as RelInclude),
	});

	let resolvedMbidCount = 0;
	for (const { resource, relations } of results) {
		const externalId = providers.extractEntityFromUrl(new URL(resource));
		if (externalId) {
			const expectedRels = relations.filter((rel) => expectedTargetTypes.has(rel['target-type']));
			const targetEntityMbids = expectedRels.map((rel) => {
				// @ts-ignore: Target type is not narrowed, but every specific value is a valid key here.
				const targetEntity = rel[rel['target-type']] as EntityWithMbid;
				return targetEntity.id;
			});

			// Check whether the external URL can be used as a unique identifier of exactly one entity.
			const uniqueTargetCount = new Set(targetEntityMbids).size;
			if (uniqueTargetCount === 1) {
				const mbid = targetEntityMbids[0];
				serializedExternalIdToMbid.set(serializeExternalId(externalId), mbid);
				resolvedMbidCount++;
				setCachedMbid(externalId, mbid);
			} else {
				// Special case: For releases we are interested in all targets, they are potential duplicates.
				const targetReleaseMbids = expectedRels
					.filter((rel) => rel['target-type'] === 'release')
					.map((rel) => rel.release.id);

				if (targetReleaseMbids.length) {
					// Hack: Collect all release MBIDs and join them for later use in `resolveReleaseMbids`.
					// They should not be cached as they are not a unique MBID!
					serializedExternalIdToMbid.set(serializeExternalId(externalId), targetReleaseMbids.join(','));
					resolvedMbidCount++;
				} else {
					log.debug(`${resource} has rels to ${uniqueTargetCount} entities`);
				}
			}
		} else {
			log.warn(`The API returned an unexpected, unsupported URL: ${resource}`);
		}
	}

	return resolvedMbidCount;
}

/** Resolves all external links for artists and labels of the given release to their MBIDs. */
export async function resolveReleaseMbids(release: HarmonyRelease) {
	const log = getLogger('harmony.mbid');
	const startTime = performance.now();
	const { artists, labels, media } = release;
	const trackArtists = media.flatMap((medium) => medium.tracklist).flatMap((track) => track.artists ?? []);

	// Cache external artist IDs for identically named artists without IDs.
	const externalArtistIds = new Map<string, ExternalEntityId[]>();
	for (const artist of artists) {
		const { name, externalIds } = artist;
		if (!externalArtistIds.has(name) && externalIds) {
			externalArtistIds.set(name, externalIds);
		}
	}

	// Reuse external artist IDs of release artists for identically named track artists.
	for (const artist of trackArtists) {
		if (!artist.externalIds?.length) {
			artist.externalIds = externalArtistIds.get(artist.name);
		}
	}

	// Trick to find potential duplicate releases on MB using the same MBID lookup logic:
	// Since we always want to check all external links, we create one entity stub per link.
	const releaseStubs: ResolvableEntity[] = release.externalLinks
		.map((link) => providers.extractEntityFromUrl(new URL(link.url)))
		.filter(isDefined)
		.map((externalId) => ({ externalIds: [externalId] }));

	// Collect all resolvable entities, dedupe them (by reference).
	// TODO: Share references in merge algorithm to dedupe by value?
	const resolvableEntities: Set<ResolvableEntity> = new Set([
		...releaseStubs,
		...artists,
		...(labels ?? []),
		...trackArtists,
	]);

	try {
		const {
			resolvedMbids,
			requests,
			lookedUpMbids,
			lookedUpUrls,
		} = await resolveMbids(resolvableEntities, ['artist', 'label', 'release']);
		const elapsedTime = performance.now() - startTime;
		let message = `Resolving external IDs to MBIDs took ${elapsedTime.toFixed(0)} ms and ${
			pluralWithCount(requests, 'API request')
		}`;
		if (requests) message += ` (for ${lookedUpUrls} URLs / ${lookedUpMbids} MBIDs)`;
		release.info.messages.push({
			type: 'debug',
			text: message,
		});
		log.debug(`Resolved ${resolvedMbids} MBIDs (${requests} req for ${lookedUpUrls} URLs / ${lookedUpMbids} MBIDs)`);

		// Store resolved release MBIDs of the external links as part of the respective provider info.
		for (const releaseStub of releaseStubs) {
			if (releaseStub.mbid) {
				const externalId = releaseStub.externalIds![0];
				const providerInfo = release.info.providers.find((provider) => provider.internalName === externalId.provider)!;
				// The stub may store multiple MBIDs, splitting them by comma handles both the hack and the regular case.
				providerInfo.linkedReleases = releaseStub.mbid.split(',');
			}
		}
	} catch (error) {
		if (error instanceof RateLimitError) {
			log.info(`${error.message}: ${encodeReleaseLookupState(release.info)}`);
			release.info.messages.push({
				type: 'warning',
				text: `Some MusicBrainz URL lookups were skipped because the API rate limit was hit:
- Please wait before trying again to resolve the remaining URLs to MBIDs.
- Consider adding more external links to MusicBrainz to reduce the number of failing lookups.
			`.trim(),
			});
		} else {
			throw error;
		}
	}
}

// Use persistent local storage in development (watch mode) when the server frequently restarts.
const cache = inDevMode ? localStorage : sessionStorage;
const cacheKeySeparator = ':';

function serializeExternalId(externalId: ExternalEntityId): string {
	const { provider, type, id } = externalId;
	return [provider, type, id].join(cacheKeySeparator);
}

function makeCacheKey(entityId: ExternalEntityId) {
	return 'mbid:' + serializeExternalId(entityId);
}

function getCachedMbid(entityId: ExternalEntityId): string | undefined {
	return cache.getItem(makeCacheKey(entityId)) ?? undefined;
}

function setCachedMbid(entityId: ExternalEntityId, mbid: string) {
	setCacheItem(makeCacheKey(entityId), mbid);
}

function setCacheItem(key: string, value: string, retries = 1) {
	try {
		cache.setItem(key, value);
	} catch (error) {
		const log = getLogger('harmony.mbid');
		log.debug(`Failed to cache item: ${error}`);
		if (retries > 0) {
			deleteRandomCacheItem();
			deleteRandomCacheItem();
			setCacheItem(key, value, retries - 1);
		} else {
			log.warn(`Caching of '${key}' failed repeatedly`);
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
