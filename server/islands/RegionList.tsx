import { Button } from '@/server/components/Button.tsx';
import { regionName } from '@/utils/locale.ts';
import { pluralWithCount } from '@/utils/plural.ts';
import { flagEmoji } from '@/utils/regions.ts';
import { useSignal } from '@preact/signals';

import type { CountryCode } from '@/harmonizer/types.ts';

export default function RegionList({ regions }: { regions: CountryCode[] }) {
	const isExpanded = useSignal(false);

	return (
		<div class={['region-list', isExpanded.value ? 'expanded' : 'collapsed'].join(' ')}>
			{isExpanded.value
				? (
					<ul>
						{regions.map((code) => (
							<li>
								{flagEmoji(code)} {regionName(code)} ({code})
							</li>
						))}
					</ul>
				)
				: regions.map((code) => (
					<>
						<abbr title={regionName(code)}>{flagEmoji(code)}</abbr>
						{' '}
					</>
				))}
			<span class='label'>{pluralWithCount(regions.length, 'region')}</span>
			{regions.length > 0 && (
				<Button onClick={() => isExpanded.value = !isExpanded.value}>
					{isExpanded.value ? 'Collapse' : 'Expand'}
				</Button>
			)}
		</div>
	);
}
