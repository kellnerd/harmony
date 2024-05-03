export type SpriteIconProps = {
	/**
	 * Identifier of the (Tabler) icon in kebab-case.
	 *
	 * Only icons which are included in `icon-sprite.svg.tsx` are available.
	 */
	name: string;
	size?: number;
	stroke?: number;
};

export function SpriteIcon({
	name,
	size = 24,
	stroke = 2,
}: SpriteIconProps) {
	return (
		<svg class='icon' width={size} height={size} stroke-width={stroke}>
			<use xlink:href={'/icon-sprite.svg#' + name} />
		</svg>
	);
}
