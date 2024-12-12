export type SpriteIconWidthProps = {
	/**
	 * Identifier of the (Tabler) icon in kebab-case.
	 *
	 * Only icons which are included in `icon-sprite.svg.tsx` are available.
	 */
	name: string;
	width?: number;
	height?: number;
	stroke?: number;
};

export function SpriteIconWidth({
	name,
	width = 24,
	height = 24,
	stroke = 2,
}: SpriteIconProps) {
	return (
		<svg class='icon' width={width} height={height} stroke-width={stroke}>
			<use xlink:href={'/icon-sprite.svg#' + name} />
		</svg>
	);
}
