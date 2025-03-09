import { ProviderIcon } from './ProviderIcon.tsx';

import { formatTimestampAsISOString } from '@/utils/time.ts';
import type { ProviderInfo } from '@/harmonizer/types.ts';

export function ProviderList({ providers }: { providers: ProviderInfo[] }) {
	return (
		<ul class='provider-list'>
			{providers.map((provider) => (
				<li data-provider={provider.name}>
					<ProviderIcon providerName={provider.name} size={20} stroke={1.5} />
					{provider.name}: <a class='provider-id' href={provider.url.href}>{provider.id}</a>
					{provider.apiUrl && <a class='label ml-2' href={provider.apiUrl.href}>API</a>}
					{provider.cacheTime && (
						<span class='label ml-2'>Cached: {formatTimestampAsISOString(provider.cacheTime)}</span>
					)}
					{provider.processingTime && <span class='label ml-2'>{provider.processingTime.toFixed(0)} ms</span>}
				</li>
			))}
		</ul>
	);
}
