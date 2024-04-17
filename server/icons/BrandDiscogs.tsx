export default function IconBrandDiscogs({
	size = 24,
	color = 'currentColor',
	stroke = 2,
	...props
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class='icon icon-tabler icon-tabler-brand-discogs'
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
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M7 20.66A10 10 0 0 0 20.66 7' />
			<path d='M17 3.34A10 10 0 0 0 3.34 17' />
			<path d='M8.5 18.06A7 7 0 0 0 18.06 8.5' />
			<path d='M15.5 5.94A7 7 0 0 0 5.94 15.5' />
			<path d='M10 15.46A4 4 0 0 0 15.46 10' />
			<path d='M14 8.54A4 4 0 0 0 8.54 14' />
			<path d='M12 12v0.01' />
		</svg>
	);
}
