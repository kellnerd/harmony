import { LinkedEntity } from './LinkedEntity.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';
import type { ExternalLink, ResolvableEntity } from '@/harmonizer/types.ts';
import { convertLinkType } from '@/musicbrainz/seeding.ts';
import { providers } from '@/providers/mod.ts';
import { musicbrainzBaseUrl } from '@/server/config.ts';
import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import { join } from 'std/url/join.ts';
import { flatten } from 'utils/object/flatten.js';

export function LinkWithMusicBrainz({ entity, entityType, sourceEntityUrl }: {
	entity: ResolvableEntity;
	entityType: EntityType;
	sourceEntityUrl: URL;
}) {
	if (!entity.externalIds?.length || !entity.mbid) return null;

	const externalLinks: ExternalLink[] = entity.externalIds.map((externalId) => {
		const provider = providers.findByName(externalId.provider)!;
		return {
			url: provider.constructUrl(externalId),
			types: provider.getLinkTypesForEntity(externalId),
		};
	});

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
