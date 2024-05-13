import { ProviderIcon } from './ProviderIcon.tsx';
import { PersistentCheckbox } from '@/server/islands/PersistentInput.tsx';

import { providers } from '@/providers/mod.ts';

export function ProviderCheckbox({ providerName, internalName, enabled = false, persistent = false }: {
	providerName: string;
	internalName: string;
	enabled?: boolean;
	persistent?: boolean;
}) {
	const id = `${internalName}-input`;

	return (
		<label htmlFor={id} className={['provider-input', internalName].join(' ')}>
			<ProviderIcon providerName={providerName} />
			{providerName}
			{persistent
				? <PersistentCheckbox name={internalName} id={id} initialValue={enabled} trueValue='' />
				: <input type='checkbox' name={internalName} id={id} checked={enabled} value='' />}
		</label>
	);
}

export function ProviderCheckboxes({ enabledProviders, persistent = false }: {
	enabledProviders?: Set<string>;
	persistent?: boolean;
}) {
	return (
		<div class='row'>
			{providers.displayNames.map((name) => {
				const internalName = providers.toInternalName(name)!;

				return (
					<ProviderCheckbox
						providerName={name}
						internalName={internalName}
						enabled={enabledProviders?.has(internalName)}
						persistent={persistent}
					/>
				);
			})}
		</div>
	);
}
