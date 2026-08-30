export default function IconBrandMelon({
	size = 24,
	color = 'currentColor',
	...props
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			id='brand-melon'
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill={color}
			{...props}
		>
			<path
				fillRule='evenodd'
				d='M2.35 14.85A8.15 8.15 0 1 0 18.65 14.85A8.15 8.15 0 1 0 2.35 14.85ZM6.96 14.85A3.54 3.54 0 1 0 14.04 14.85A3.54 3.54 0 1 0 6.96 14.85ZM15.45 4.1A3.1 3.1 0 1 0 21.65 4.1A3.1 3.1 0 1 0 15.45 4.1Z'
			/>
		</svg>
	);
}
