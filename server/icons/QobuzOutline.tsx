export default function IconBrandQobuz({
	size = 24,
	color = 'currentColor',
	stroke = 2,
	...props
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 40 40'
			width={size}
			height={size}
			stroke-width={stroke}
			stroke={color}
			fill='none'
			class='brand-qobuz'
			id='brand-qobuz'
			{...props}
		>
			<circle
				cx='15.435'
				cy='19.905'
				r='13.215'
				style='fill: rgba(255, 255, 255, 0); stroke-width: 3.22823px;'
			>
			</circle>
			<path
				fill='#FFFFFF'
				style='stroke-width: 1.8px;'
				d='M29.527,32.372l-7.691-7.708c-0.227-0.301-0.586-0.496-0.991-0.496c-0.686,0-1.242,0.556-1.242,1.242     c0,0.334,0.133,0.637,0.348,0.861l0,0l0,0c0.014,0.015,0.03,0.03,0.045,0.044l7.838,7.663L29.527,32.372z'
			>
			</path>
			<circle
				cx='15.47'
				cy='19.872'
				r='3.264'
				style='fill: rgba(255, 255, 255, 0); stroke-width: 2.42117px;'
			>
			</circle>
		</svg>
	);
}
