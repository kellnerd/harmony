import { Button } from '../components/Button.tsx';
import { regionName } from '../../utils/locale.ts';
import { pluralWithCount } from '../../utils/plural.ts';
import { flagEmoji } from '../../utils/regions.ts';
import { useState } from 'preact/hooks';

import type { CountryCode } from '../../harmonizer/types.ts';

export default function RegionList({ regions }: { regions: CountryCode[] }) {
	const [isExpanded, setExpanded] = useState(false);

	return (
		<div class={['region-list', isExpanded ? 'expanded' : 'collapsed'].join(' ')}>
			{isExpanded
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
			({pluralWithCount(regions.length, 'region')})
			<Button onClick={() => setExpanded(!isExpanded)}>
				{isExpanded ? 'Collapse' : 'Expand'}
			</Button>
		</div>
	);
}
