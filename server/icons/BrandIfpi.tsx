export default function IconBrandIfpi({
	size = 24,
	color = 'currentColor',
	stroke = 2,
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
			{...props}
		>
			<path d='m2.5 4.5v14.2' />
			<path d='m21.4 4.5v14.2' />
			<path d='m11.2 5.6h-4.9v13.1' />
			<path d='m6 11.7h4.5' />
			<path d='m13.5 18.7v-13.1h3l1.1 1.1v4.5l-1.1 1.1h-3' />
		</svg>
	);
}
