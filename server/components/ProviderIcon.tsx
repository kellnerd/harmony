import { SpriteIcon, type SpriteIconProps } from '@/server/components/SpriteIcon.tsx';

import { providers } from '@/providers/mod.ts';

const providerIconMap: Record<string, string> = {
	bandcamp: 'brand-bandcamp',
	beatport: 'brand-beatport',
	deezer: 'brand-deezer',
	itunes: 'brand-apple',
	musicbrainz: 'brand-metabrainz',
	tidal: 'brand-tidal',
};

export type ProviderIconProps = Omit<SpriteIconProps, 'name'> & {
	providerName: string;
};

export function ProviderIcon({ providerName, ...iconProps }: ProviderIconProps) {
	let internalName = providers.toInternalName(providerName);
	let displayName = providers.toDisplayName(providerName);

	// TODO: Remove workaround once MB is a properly supported MetadataProvider.
	if (providerName === 'MusicBrainz') {
		internalName = providerName.toLowerCase();
		displayName = providerName;
	}

	const iconName = internalName && providerIconMap[internalName];
	const fallbackIcon = 'puzzle';

	return (
		<span class={internalName} title={displayName}>
			<SpriteIcon name={iconName ?? fallbackIcon} {...iconProps} />
		</span>
	);
}
