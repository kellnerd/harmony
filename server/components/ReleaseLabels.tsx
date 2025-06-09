import type { Label } from '@/harmonizer/types.ts';
import { classList } from '@/utils/jsx.ts';
import { LinkedEntity } from './LinkedEntity.tsx';

export function ReleaseLabels({ labels, inline }: {
	labels: Label[];
	inline?: boolean;
}) {
	return (
		<ul class={classList('release-labels', inline && 'inline')}>
			{labels.map((label) => (
				<li>
					<LinkedEntity entity={label} entityType='label' displayName={label.name ?? '[unknown]'} />{' '}
					{label.catalogNumber}
				</li>
			))}
		</ul>
	);
}
