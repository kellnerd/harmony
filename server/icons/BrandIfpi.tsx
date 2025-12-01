export default function IconBrandIfpi({
	size = 24,
	color = 'currentColor',
	stroke = 2,
	...props
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			id='brand-ifpi'
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
			<path d='m10.4 5.6c-0.5 2.6-3.9 13.1-8 10.5-3.7-2.3 6.7-10.3 20-9.7' />
			<g stroke-width={1}>
				<path d='m11.8 10.9v0.01' />
				<path d='m11.5 12.7-0.5 3.8' />
				<path d='m13.4 16.7 0.6-5.2c0.1-1 0.6-1.4 1.3-1.4m-0.5 2.5h-1.7' />
				<path d='m15.8 18.6 0.8-6c4-1.4 3.5 4.6-0.5 4' />
				<path d='m21.8 10.8v0.01' />
				<path d='m21.5 12.6-0.5 3.8' />
			</g>
		</svg>
	);
}
