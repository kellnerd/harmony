import { ProviderIcon } from './ProviderIcon.tsx';
import { PersistentCheckbox } from '@/server/islands/PersistentInput.tsx';

import { defaultProviders, providers } from '@/providers/mod.ts';

export function ProviderCheckbox({ providerName, internalName, enabled = false }: {
	providerName: string;
	internalName: string;
	enabled: boolean;
}) {
	const id = `${internalName}-input`;

	return (
		<label htmlFor={id} className={['provider-input', internalName].join(' ')}>
			<ProviderIcon providerName={providerName} />
			{providerName}
			<PersistentCheckbox name={internalName} id={id} defaultValue={enabled} trueValue='' />
		</label>
	);
}

export function ProviderCheckboxes({ enabledProviders }: { enabledProviders?: Set<string> }) {
	return (
		<div className='provider-inputs'>
			{providers.displayNames.map((name) => {
				const internalName = providers.toInternalName(name)!;
				const enabled = enabledProviders ? enabledProviders.has(internalName) : defaultProviders.has(internalName);
				return <ProviderCheckbox providerName={name} internalName={internalName} enabled={enabled} />;
			})}
		</div>
	);
}
