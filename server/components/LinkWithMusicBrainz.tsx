import { LinkedEntity } from './LinkedEntity.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';
import type { ExternalLink, ResolvableEntity } from '@/harmonizer/types.ts';
import { convertLinkType } from '@/musicbrainz/seeding.ts';
import { providers } from '@/providers/mod.ts';
import { musicbrainzBaseUrl } from '@/server/config.ts';
import type { EntityWithMbid } from '@kellnerd/musicbrainz/api-types';
import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import { join } from 'std/url/join.ts';
import { flatten } from 'utils/object/flatten.js';

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

export function LinkWithMusicBrainz({ entity, entityType, sourceEntityUrl, entityCache }: {
	entity: ResolvableEntity;
	entityType: EntityType;
	sourceEntityUrl: URL;
	entityCache?: EntityWithUrlRels[];
}) {
	if (!entity.externalIds?.length || !entity.mbid) return null;

	// Get the entity from the cache and check which links already exist in MB.
	const mbEntity = entityCache?.find((e) => e.id === entity.mbid);
	const existingLinks = new Set(mbEntity?.relations.map((urlRel) => urlRel.url.resource));

	// Convert external IDs into links and discard those which already exist.
	const externalLinks: ExternalLink[] = entity.externalIds.map((externalId) => {
		const provider = providers.findByName(externalId.provider)!;
		return {
			url: provider.constructUrl(externalId),
			types: provider.getLinkTypesForEntity(externalId),
		};
	}).filter((link) => !existingLinks.has(link.url.href));

	if (!externalLinks.length) return null;

	// Construct link to seed the MB entity editor.
	const mbEditLink = join(musicbrainzBaseUrl, entityType, entity.mbid, 'edit');
	mbEditLink.search = new URLSearchParams(flatten({
		[`edit-${entityType}`]: {
			url: externalLinks.flatMap((link) =>
				link.types?.length
					? link.types.map((type) => ({
						text: link.url.href,
						link_type_id: convertLinkType(entityType, type, link.url),
					}))
					: ({ text: link.url.href })
			),
			edit_note: `Matched ${entityType} while importing ${sourceEntityUrl} with Harmony`,
		},
	})).toString();

	return (
		<div class='message'>
			<SpriteIcon name='link' />
			<div>
				<p>
					<a href={mbEditLink.href}>
						Link external IDs
					</a>
					{' of '}
					<LinkedEntity entity={entity} entityType={entityType} displayName={entity.name ?? '[unknown]'} />{' '}
					to MusicBrainz
				</p>
			</div>
		</div>
	);
}
