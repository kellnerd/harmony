import { SpriteIcon, type SpriteIconProps } from '@/server/components/SpriteIcon.tsx';

import { simplifyName } from 'utils/string/simplify.js';

const providerIconMap: Record<string, string> = {
	bandcamp: 'brand-bandcamp',
	beatport: 'brand-beatport',
	deezer: 'brand-deezer',
	itunes: 'brand-apple',
	musicbrainz: 'brand-metabrainz',
};

export type ProviderIconProps = Omit<SpriteIconProps, 'name'> & {
	providerName: string;
};

export function ProviderIcon({ providerName, ...iconProps }: ProviderIconProps) {
	const simpleName = simplifyName(providerName);
	const iconName = providerIconMap[simpleName] ?? 'puzzle';

	return (
		<span class={simpleName} title={providerName}>
			<SpriteIcon name={iconName} {...iconProps} />
		</span>
	);
}
