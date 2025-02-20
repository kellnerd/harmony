import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';

import { musicbrainzTargetServer } from '@/config.ts';
import type { ResolvableEntity } from '@/harmonizer/types.ts';
import { providers } from '@/providers/mod.ts';
import { type EntityType } from '@kellnerd/musicbrainz';
import { join } from 'std/url/join.ts';

export function LinkedEntity({ entity, entityType, displayName }: {
	entity: ResolvableEntity;
	entityType: EntityType;
	displayName: string;
}) {
	return (
		<span class='entity-links'>
			{entity.externalIds?.map((entityId) => (
				<a href={providers.constructEntityUrl(entityId).href}>
					<ProviderIcon providerName={entityId.provider} size={18} stroke={1.5} />
				</a>
			))}
			{entity.mbid
				? (
					<a href={join(musicbrainzTargetServer, entityType, entity.mbid).href}>
						<ProviderIcon providerName='MusicBrainz' size={18} stroke={1.5} />
						{displayName}
					</a>
				)
				: displayName}
		</span>
	);
}
