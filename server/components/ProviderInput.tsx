import { ProviderIcon } from './ProviderIcon.tsx';
import { providers } from '@/providers/mod.ts';

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
			<input type='checkbox' name={internalName} id={id} checked={enabled} value='' />
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
				return <ProviderCheckbox providerName={name} internalName={internalName} enabled={enabled} />;
			})}
		</div>
	);
}
