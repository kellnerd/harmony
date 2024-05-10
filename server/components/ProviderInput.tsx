import { ProviderIcon } from './ProviderIcon.tsx';
import { providers } from '@/providers/mod.ts';

export function ProviderCheckbox({ providerName, simpleName, enabled = false }: {
	providerName: string;
	simpleName: string;
	enabled: boolean;
}) {
	const id = `${simpleName}-input`;

	return (
		<label htmlFor={id} className={['provider-input', simpleName].join(' ')}>
			<ProviderIcon providerName={providerName} />
			{providerName}
			<input type='checkbox' name={simpleName} id={id} checked={enabled} value='' />
		</label>
	);
}

export function ProviderCheckboxes({ enabledProviders }: { enabledProviders?: Set<string> }) {
	return (
		<div className='provider-inputs'>
			{providers.displayNames.map((name) => {
				const internalName = providers.toInternalName(name)!;
				// TODO: Define default providers as a constant and use these as fallback.
				const enabled = enabledProviders ? enabledProviders.has(internalName) : false;
				return <ProviderCheckbox providerName={name} simpleName={internalName} enabled={enabled} />;
			})}
		</div>
	);
}
