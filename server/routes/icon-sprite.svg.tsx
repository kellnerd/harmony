import IconBrandMetaBrainz from '@/server/icons/BrandMetaBrainz.tsx';
import IconBrandApple from 'tabler-icons/brand-apple.tsx';
import IconBrandBandcamp from 'tabler-icons/brand-bandcamp.tsx';
import IconBrandDeezer from 'tabler-icons/brand-deezer.tsx';
import IconAlertTriangle from 'tabler-icons/alert-triangle.tsx';
import IconBug from 'tabler-icons/bug.tsx';
import IconInfoCircle from 'tabler-icons/info-circle.tsx';
import IconPuzzle from 'tabler-icons/puzzle.tsx';

import type { Handlers } from 'fresh/server.ts';
import type { JSX } from 'preact';
import { renderToString } from 'preact-render-to-string';

type Icon = typeof IconBrandMetaBrainz;

const icons: Icon[] = [
	IconAlertTriangle,
	IconBug,
	IconInfoCircle,
	IconBrandApple,
	IconBrandBandcamp,
	IconBrandDeezer,
	IconBrandMetaBrainz,
	IconPuzzle,
];

function makeSvgSymbol(icon: Icon) {
	// Inherit properties of the SVG <symbol> element from the <svg> element.
	const { children, class: className, fill, stroke, viewBox } = icon({}).props as JSX.SVGAttributes<SVGSVGElement>;
	const iconName = className!.toString().replace('icon icon-tabler icon-tabler-', '');

	return (
		<symbol
			id={iconName}
			viewBox={viewBox}
			fill={fill}
			stroke={stroke}
			stroke-linecap='round'
			stroke-linejoin='round'
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
