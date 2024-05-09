export default function IconBrandBeatport({
	size = 24,
	color = 'currentColor',
	stroke = 2,
	...props
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class='icon icon-tabler icon-tabler-brand-beatport'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			stroke-width={stroke}
			stroke={color}
			fill='none'
			stroke-linecap='round'
			stroke-linejoin='round'
			{...props}
		>
			<circle cx={14.5} cy={16} r={6} />
			<path d='m 3.5,16 4,-4 c 1,-1 2,-2 2,-4 V 2' />
		</svg>
	);
}
