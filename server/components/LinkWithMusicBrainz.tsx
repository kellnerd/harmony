import { LinkedEntity } from './LinkedEntity.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';
import { OpenAllLinks } from '@/server/islands/OpenAllLinks.tsx';

import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import { type EntityWithUrlRels, getEditUrlToSeedExternalLinks } from '@/musicbrainz/edit_link.ts';
import type { ResolvableEntity } from '@/harmonizer/types.ts';
import { isDefined } from '@/utils/predicate.ts';
import { providers } from '@/providers/mod.ts';

/**
 * Renders a list of MusicBrainz edit links to add external links, based on the provided entities and entity type.
 * If multiple entities are present, a button to open all MusicBrainz edit links at once is shown.
 */
export function LinkWithMusicBrainz({ entities, entityType, sourceEntityUrl, entityCache }: {
	entities: ResolvableEntity[];
	entityType: EntityType;
	sourceEntityUrl: URL;
	entityCache?: EntityWithUrlRels[];
}) {
	// No entities or no source entity URL to link from, nothing to render.
	if (!sourceEntityUrl) return null;

	const entitiesWithMbEditLinks = entities.map((entity) => {
		const mbEditLink = getEditUrlToSeedExternalLinks({ entity, entityType, sourceEntityUrl, entityCache, providers });
		if (mbEditLink) {
			return { entity, mbEditLink };
		}
	}).filter(isDefined);

	if (entitiesWithMbEditLinks.length === 0) return null;

	const actions = entitiesWithMbEditLinks.map(({ entity, mbEditLink }) => (
		<LinkWithMusicBrainzAction
			mbEditLink={mbEditLink}
			entity={entity}
			entityType={entityType}
		/>
	));
	if (actions.length > 1) {
		return (
			<div class='action-group'>
				<OpenAllLinks
					links={entitiesWithMbEditLinks.map(({ mbEditLink }) => mbEditLink.href)}
					linkType={entityType}
				/>
				{actions}
			</div>
		);
	} else {
		return actions[0];
	}
}

function LinkWithMusicBrainzAction({ mbEditLink, entity, entityType }: {
	mbEditLink: URL;
	entity: ResolvableEntity;
	entityType: EntityType;
}) {
	return (
		<div class='action'>
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
