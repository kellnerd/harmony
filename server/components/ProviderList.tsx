import { ProviderIcon } from './ProviderIcon.tsx';

import { formatTimestampAsISOString } from '@/utils/time.ts';
import type { ProviderInfo } from '@/harmonizer/types.ts';

export function ProviderList({ providers }: { providers: ProviderInfo[] }) {
	return (
		<ul>
			{providers.map((provider) => (
				<li>
					<ProviderIcon providerName={provider.name} size={20} stroke={1.5} />
					{provider.name}: <a href={provider.url.href} target='_blank'>{provider.id}</a>
					{provider.apiUrl && <a class='label ml-2' href={provider.apiUrl.href} target='_blank'>API</a>}
					{provider.cacheTime && (
						<span class='label ml-2'>Cached: {formatTimestampAsISOString(provider.cacheTime)}</span>
					)}
					{provider.processingTime && <span class='label ml-2'>{provider.processingTime.toFixed(0)} ms</span>}
				</li>
			))}
		</ul>
	);
}
