export default function IconBrandBeatport({
	size = 24,
	color = 'currentColor',
	stroke = 2,
	...props
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class='icon icon-tabler icon-tabler-brand-hoerspielforscher'
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
			<path d='m 5,2 h 5 v 11 h 4 v -11 h 5 v 20 h -5 v -5 h -4 v 5 h -5 z' />
		</svg>
	);
}
