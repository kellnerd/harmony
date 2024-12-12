export default function IconBrandIfpi({
	size = 24,
	color = 'currentColor',
	stroke = 2.,
	...props
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class='icon icon-tabler icon-tabler-brand-ifpi'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			stroke-width={stroke}
			stroke={color}
			fill='none'
			stroke-linecap='butt'
			stroke-linejoin='butt'
			{...props}
		>
			<g transform='translate(-343.3 -311.3)'>
				<path d='m345.8 315.8v14.25' />
				<path d='m364.7 315.8v14.25' />
				<path d='m354.5 316.9h-4.875v13.12' />
				<path d='m348.5 323h5.25' />
				<path d='m356.8 330v-13.12h3l1.125 1.125v4.5l-1.125 1.125h-3' />
			</g>
		</svg>
	);
}
