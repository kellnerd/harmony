import IconBrandBeatport from '@/server/icons/BrandBeatport.tsx';
import IconBrandIfpi from '@/server/icons/BrandIfpi.tsx';
import IconBrandMetaBrainz from '@/server/icons/BrandMetaBrainz.tsx';
import IconBrandApple from 'tabler-icons/brand-apple.tsx';
import IconBrandBandcamp from 'tabler-icons/brand-bandcamp.tsx';
import IconBrandDeezer from 'tabler-icons/brand-deezer.tsx';
import IconBrandGit from 'tabler-icons/brand-git.tsx';
import IconBrandSpotify from 'tabler-icons/brand-spotify.tsx';
import IconBrandTidal from 'tabler-icons/brand-tidal.tsx';
import IconAlertTriangle from 'tabler-icons/alert-triangle.tsx';
import IconBarcode from 'tabler-icons/barcode.tsx';
import IconBug from 'tabler-icons/bug.tsx';
import IconDatabaseEdit from 'tabler-icons/database-edit.tsx';
import IconDatabaseImport from 'tabler-icons/database-import.tsx';
import IconDisc from 'tabler-icons/disc.tsx';
import IconHelp from 'tabler-icons/help.tsx';
import IconInfoCircle from 'tabler-icons/info-circle.tsx';
import IconLink from 'tabler-icons/link.tsx';
import IconPhotoPlus from 'tabler-icons/photo-plus.tsx';
import IconPuzzle from 'tabler-icons/puzzle.tsx';
import IconSearch from 'tabler-icons/search.tsx';
import IconVideo from 'tabler-icons/video.tsx';
import IconWorldPin from 'tabler-icons/world-pin.tsx';
import IconWorldWww from 'tabler-icons/world-www.tsx';

import type { Handlers } from 'fresh/server.ts';
import type { JSX } from 'preact';
import { renderToString } from 'preact-render-to-string';

type Icon = typeof IconBrandMetaBrainz;

const icons: Icon[] = [
	IconAlertTriangle,
	IconBarcode,
	IconBug,
	IconDatabaseEdit,
	IconDatabaseImport,
	IconDisc,
	IconHelp,
	IconInfoCircle,
	IconLink,
	IconPhotoPlus,
	IconSearch,
	IconVideo,
	IconWorldPin,
	IconWorldWww,

	// Brand icons
	IconBrandApple,
	IconBrandBandcamp,
	IconBrandBeatport,
	IconBrandDeezer,
	IconBrandGit,
	IconBrandIfpi,
	IconBrandMetaBrainz,
	IconBrandSpotify,
	IconBrandTidal,
	IconPuzzle,
];

function makeSvgSymbol(icon: Icon) {
	// Inherit properties of the SVG <symbol> element from the <svg> element.
	const {
		children,
		class: className,
		fill,
		stroke,
		'stroke-linecap': strokeLinecap,
		'stroke-linejoin': strokeLinejoin,
		viewBox,
	} = icon({}).props as JSX.SVGAttributes<SVGSVGElement>;
	const iconName = className!.toString().replace('icon icon-tabler icon-tabler-', '');

	return (
		<symbol
			id={iconName}
			viewBox={viewBox}
			fill={fill}
			stroke={stroke}
			stroke-linecap={strokeLinecap}
			stroke-linejoin={strokeLinejoin}
		>
			{children}
		</symbol>
	);
}

export const handler: Handlers = {
	GET() {
		const svgSprite = renderToString(
			<svg xmlns='http://www.w3.org/2000/svg'>
				<defs>
					{icons.map(makeSvgSymbol)}
				</defs>
			</svg>,
		);

		return new Response(svgSprite, {
			headers: {
				'Content-Type': 'image/svg+xml',
			},
		});
	},
};
