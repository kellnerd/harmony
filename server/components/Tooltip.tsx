import { SpriteIcon } from './SpriteIcon.tsx';

import type { JSX } from 'preact';

export function Tooltip({ iconName = 'help', ...props }: { iconName?: string } & JSX.HTMLAttributes<HTMLDivElement>) {
	return (
		<span class='tooltip-anchor'>
			<SpriteIcon name={iconName} />
			<div role='tooltip' {...props} />
		</span>
	);
}
