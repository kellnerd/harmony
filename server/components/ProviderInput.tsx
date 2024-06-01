import { ProviderIcon } from './ProviderIcon.tsx';
import { PersistentCheckbox } from '@/server/islands/PersistentInput.tsx';

import { providers } from '@/providers/mod.ts';
import { FeatureQuality } from '@/providers/features.ts';

export function ProviderCheckbox({
	providerName,
	internalName,
	disabled = false,
	enabled = false,
	persistent = false,
}: {
	providerName: string;
	internalName: string;
	disabled?: boolean;
	enabled?: boolean;
	persistent?: boolean;
}) {
	const id = `${internalName}-input`;

	return (
		<label
			htmlFor={id}
			className={['provider-input', internalName].join(' ')}
			title={disabled ? 'Provider does not support GTIN lookups' : undefined}
		>
			<ProviderIcon providerName={providerName} />
			{providerName}
			{(persistent && !disabled)
				? <PersistentCheckbox name={internalName} id={id} initialValue={enabled} trueValue='' />
				: <input type='checkbox' name={internalName} id={id} checked={enabled} value='' disabled={disabled} />}
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
						disabled={providers.findByName(name)!.getQuality('GTIN lookup') <=
							FeatureQuality.UNKNOWN}
						enabled={enabledProviders?.has(internalName)}
						persistent={persistent}
					/>
				);
			})}
		</div>
	);
}
