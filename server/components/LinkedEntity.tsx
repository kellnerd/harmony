import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';

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
					<a href={join('https://musicbrainz.org/', entityType, entity.mbid).href}>
						<ProviderIcon providerName='MusicBrainz' size={18} stroke={1.5} />
						{displayName}
					</a>
				)
				: displayName}
		</span>
	);
}
