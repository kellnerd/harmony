import { LinkedEntity } from './LinkedEntity.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import { type EntityWithUrlRels, getMusicBrainzEditLink } from '@/utils/mbLink.ts';
import type { ResolvableEntity } from '@/harmonizer/types.ts';
import { OpenAllLinks } from '@/server/islands/OpenAllLinks.tsx';
import { classList } from '@/utils/jsx.ts';

type EntityWithMbEditLink = {
	entity: ResolvableEntity;
	mbEditLink: URL;
};

/**
 * Renders a list of MusicBrainz edit links to add external links, based on the provided entities and entity type.
 * If multiple entities are present, a button to open all MusicBrainz edit links at once is shown.
 */
export function LinkWithMusicBrainz({ entities, entityType, sourceEntityUrl, entityCache }: {
	entities: ResolvableEntity[];
	entityType: EntityType;
	sourceEntityUrl?: URL;
	entityCache?: EntityWithUrlRels[];
}) {
	// No entities or no source entity URL to link from, nothing to render.
	if (!sourceEntityUrl) return null;

	const entitiesWithMbEditLinks = entities.map((entity) => ({
		entity,
		mbEditLink: getMusicBrainzEditLink(entity, entityType, sourceEntityUrl, entityCache),
	}))
		.filter(isEntityWithMbEditLink);

	if (entitiesWithMbEditLinks.length === 0) return null;

	const hasMultipleEntities = entitiesWithMbEditLinks.length > 1;

	return (
		<div class={classList(hasMultipleEntities && 'message-group')}>
			{hasMultipleEntities && (
				<OpenAllLinks
					mbEditLinks={entitiesWithMbEditLinks.map(({ mbEditLink }) => mbEditLink.href)}
					entityType={entityType}
				/>
			)}
			{entitiesWithMbEditLinks.map(({ entity, mbEditLink }) => (
				<LinkWithMusicBrainzEntry
					mbEditLink={mbEditLink}
					entity={entity}
					entityType={entityType}
				/>
			))}
		</div>
	);
}

function LinkWithMusicBrainzEntry({ mbEditLink, entity, entityType }: {
	mbEditLink: URL;
	entity: ResolvableEntity;
	entityType: EntityType;
}) {
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

function isEntityWithMbEditLink(x: unknown): x is EntityWithMbEditLink {
	return typeof x === 'object' && x !== null && 'entity' in x && 'mbEditLink' in x && x.mbEditLink instanceof URL;
}
