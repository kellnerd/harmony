export default function IconBrandMetaBrainzFilled({
	size = 24,
	color = 'currentColor',
	stroke = 2,
	...props
}) {
	const brainzColor = color === 'currentColor' ? undefined : '#eb743b';
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			class='icon icon-tabler icon-tabler-brand-metabrainz'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			stroke-width={stroke}
			stroke={color}
			fill={color}
			stroke-linecap='round'
			stroke-linejoin='round'
			{...props}
		>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M2.5 6.5v11l8 4.6V1.9z' />
			<path stroke={brainzColor} d='M21.5 6.5v11l-8 4.6V1.9z' fill={brainzColor} />
		</svg>
	);
}
