import { ResolvableEntity } from '@/harmonizer/types.ts';
import { constructEntityUrl } from '@/providers/mod.ts';
import { EntityType } from '@kellnerd/musicbrainz';
import { join } from 'std/url/join.ts';

export function LinkedEntity({ entity, entityType, displayName }: {
	entity: ResolvableEntity;
	entityType: EntityType;
	displayName: string;
}) {
	const musicbrainzLink = entity.mbid ? join('https://musicbrainz.org/', entityType, entity.mbid).href : undefined;

	return (
		<span class='entity-links'>
			{entity.externalIds?.map((entityId) => (
				<>
					<a class={entityId.provider} href={constructEntityUrl(entityId).href}>
						{entityId.provider.charAt(0).toUpperCase()}
					</a>
					{' '}
				</>
			))}
			<a class='musicbrainz' href={musicbrainzLink}>{displayName}</a>
		</span>
	);
}
