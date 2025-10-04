import { join } from 'std/url/join.ts';
import { flatten } from 'utils/object/flatten.js';
import { musicbrainzTargetServer } from '@/config.ts';
import { convertLinkType } from '@/musicbrainz/seeding.ts';
import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import type { EntityWithMbid } from '@kellnerd/musicbrainz/api-types';
import type { ExternalLink, ResolvableEntity } from '@/harmonizer/types.ts';
import type { ProviderRegistry } from '@/providers/registry.ts';

// TODO: incomplete type, expose a suitable type from @kellnerd/musicbrainz?
// interface $EntityWithUrlRels extends EntityWithMbid, WithRels<'url-rels'> {}
// type EntityWithUrlRels = WithIncludes<$EntityWithUrlRels, 'url-rels'>
export interface EntityWithUrlRels extends EntityWithMbid {
	relations: Array<{
		url: {
			resource: string;
		};
	}>;
}

export function getEditUrlToSeedExternalLinks(
	{ entity, entityType, sourceEntityUrl, entityCache, providers }: {
		entity: ResolvableEntity;
		entityType: EntityType;
		sourceEntityUrl: URL;
		entityCache?: EntityWithUrlRels[];
		/**
		 * Registry of available metadata providers to construct external URLs and get link types.
		 * Sent as a parameter to allow easier testing/mocking.
		 */
		providers: ProviderRegistry;
	},
): URL | null {
	if (!entity.externalIds?.length || !entity.mbid) return null;

	// Get the entity from the cache and check which links already exist in MB.
	const mbEntity = entityCache?.find((e) => e.id === entity.mbid);
	const existingLinks = new Set(mbEntity?.relations.map((urlRel) => urlRel.url.resource));

	// Convert external IDs into links and discard those which already exist.
	const externalLinks: ExternalLink[] = entity.externalIds.map((externalId) => {
		const provider = providers.findByName(externalId.provider)!;
		return {
			url: provider.constructUrl(externalId).href,
			types: externalId.linkTypes ?? provider.getLinkTypesForEntity(externalId),
		};
	}).filter((link) => !existingLinks.has(link.url));

	if (!externalLinks.length) return null;

	// Construct link to seed the MB entity editor.
	const mbEditLink = join(musicbrainzTargetServer, entityType, entity.mbid, 'edit');
	mbEditLink.search = new URLSearchParams(flatten({
		[`edit-${entityType}`]: {
			url: externalLinks.flatMap((link) =>
				link.types?.length
					? link.types.map((type) => ({
						text: link.url,
						link_type_id: convertLinkType(entityType, type, new URL(link.url)),
					}))
					: ({ text: link.url })
			),
			edit_note: `Matched ${entityType} while importing ${sourceEntityUrl} with Harmony`,
		},
	})).toString();

	return mbEditLink;
}
