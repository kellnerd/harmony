import { PersistentTextInput } from '@/server/islands/PersistentInput.tsx';
import InputWithOverlay, { applyOverlayToInput } from './InputWithOverlay.tsx';
import { ProviderCheckboxes } from './ProviderInput.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import type { GTIN } from '@/harmonizer/types.ts';
import { defaultProviders } from '@/providers/mod.ts';

interface ReleaseLookupProps {
	enabledProviders?: Set<string>;
	gtin?: GTIN;
	externalUrl?: string;
	regions?: string[];
	formAction?: string;
}

export default function ReleaseLookup({
	enabledProviders,
	gtin = '',
	externalUrl = '',
	regions = [],
	formAction = '',
}: ReleaseLookupProps) {
	const regionValue = regions.join(',');
	const isActiveLookup = (externalUrl !== '') || (gtin !== '') || Boolean(enabledProviders?.size);
	if (!isActiveLookup) {
		enabledProviders = defaultProviders;
	}

	return (
		<form action={formAction} class='center'>
			<div class='row'>
				<InputWithOverlay name='url' id='url-input' value={externalUrl} placeholder='Provider URL'>
					<SpriteIcon name='world-www' />
				</InputWithOverlay>
				<InputWithOverlay name='gtin' id='gtin-input' value={gtin} placeholder='GTIN/EAN/UPC (Barcode)'>
					<SpriteIcon name='barcode' />
				</InputWithOverlay>
				{applyOverlayToInput(
					<SpriteIcon name='world-pin' />,
					isActiveLookup
						? (
							<input
								type='text'
								name='region'
								id='region-input'
								value={regionValue}
								placeholder='Region (Country Code)'
							/>
						)
						: (
							<PersistentTextInput
								name='region'
								id='region-input'
								namespace='persist'
								initialValue={regionValue}
								placeholder='Region (Country Code)'
								storeChanges={false}
							/>
						),
				)}
				<InputWithOverlay type='submit' value='Lookup'>
					<SpriteIcon name='search' />
				</InputWithOverlay>
			</div>
			<ProviderCheckboxes enabledProviders={enabledProviders} loadDefaults={!isActiveLookup} storeChanges={false} />
		</form>
	);
}
