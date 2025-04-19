import { ProviderIcon } from './ProviderIcon.tsx';
import { PersistentCheckbox } from '@/server/islands/PersistentInput.tsx';

import { providers } from '@/providers/mod.ts';
import { FeatureQuality } from '@/providers/features.ts';

export function ProviderCheckbox({
	providerName,
	internalName,
	disabled = false,
	enabled = false,
	loadDefaults = false,
	storeChanges = false,
}: {
	providerName: string;
	internalName: string;
	disabled?: boolean;
	enabled?: boolean;
	loadDefaults?: boolean;
	storeChanges?: boolean;
}) {
	const id = `${internalName}-input`;

	return (
		<label
			for={id}
			class={['provider-input', internalName].join(' ')}
			title={disabled ? 'Provider does not support GTIN lookups' : undefined}
		>
			<ProviderIcon providerName={providerName} />
			{providerName}
			{(loadDefaults && !disabled)
				? (
					<PersistentCheckbox
						name={internalName}
						id={id}
						namespace='persist'
						initialValue={enabled}
						formValue=''
						storeChanges={storeChanges}
						useCookie={storeChanges}
					/>
				)
				: <input type='checkbox' name={internalName} id={id} checked={enabled} value='' disabled={disabled} />}
		</label>
	);
}

export function ProviderCheckboxes({ enabledProviders, loadDefaults = false, storeChanges = false }: {
	enabledProviders?: Set<string>;
	loadDefaults?: boolean;
	storeChanges?: boolean;
}) {
	return (
		<div class='row'>
			{providers.displayNames.map((name) => {
				const internalName = providers.toInternalName(name)!;

				return (
					<ProviderCheckbox
						providerName={name}
						internalName={internalName}
						disabled={providers.findByName(name)!.getQuality('GTIN lookup') <=
							FeatureQuality.UNKNOWN}
						enabled={enabledProviders?.has(internalName)}
						loadDefaults={loadDefaults}
						storeChanges={storeChanges}
					/>
				);
			})}
		</div>
	);
}
