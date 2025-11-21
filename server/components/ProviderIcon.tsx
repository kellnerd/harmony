import { SpriteIcon, type SpriteIconProps } from '@/server/components/SpriteIcon.tsx';

import { providers } from '@/providers/mod.ts';

const providerIconMap: Record<string, string> = {
	bandcamp: 'brand-bandcamp',
	beatport: 'brand-beatport',
	deezer: 'brand-deezer',
	itunes: 'brand-apple',
	musicbrainz: 'brand-metabrainz',
	mora: 'brand-mora',
	spotify: 'brand-spotify',
	tidal: 'brand-tidal',
};

export type ProviderIconProps = Omit<SpriteIconProps, 'name'> & {
	providerName: string;
};

export function ProviderIcon({ providerName, ...iconProps }: ProviderIconProps) {
	const internalName = providers.toInternalName(providerName);
	const displayName = providers.toDisplayName(providerName);

	const iconName = internalName && providerIconMap[internalName];
	const fallbackIcon = 'puzzle';

	return (
		<span class={internalName} title={displayName}>
			<SpriteIcon name={iconName ?? fallbackIcon} {...iconProps} />
		</span>
	);
}
