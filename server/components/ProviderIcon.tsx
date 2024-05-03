import IconBrandMetaBrainz from '@/server/icons/BrandMetaBrainz.tsx';
import IconBrandApple from 'tabler-icons/brand-apple.tsx';
import IconBrandBandcamp from 'tabler-icons/brand-bandcamp.tsx';
import IconBrandDeezer from 'tabler-icons/brand-deezer.tsx';
import IconPuzzle from 'tabler-icons/puzzle.tsx';

import { simplifyName } from 'utils/string/simplify.js';

type Icon = typeof IconPuzzle;

type IconProps = Parameters<Icon>[0];

const providerIconMap: Record<string, Icon> = {
	bandcamp: IconBrandBandcamp,
	deezer: IconBrandDeezer,
	itunes: IconBrandApple,
	musicbrainz: IconBrandMetaBrainz,
};

export function ProviderIcon({ providerName, ...iconProps }: { providerName: string } & IconProps) {
	const simpleName = simplifyName(providerName);
	const icon = providerIconMap[simpleName] ?? IconPuzzle;

	return (
		<span class={simpleName} title={providerName}>
			{icon({ ...iconProps })}
		</span>
	);
}
