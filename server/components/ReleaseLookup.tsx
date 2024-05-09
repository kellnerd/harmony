import InputWithOverlay from './InputWithOverlay.tsx';
import { ProviderCheckboxes } from './ProviderInput.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import type { GTIN } from '@/harmonizer/types.ts';

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
	return (
		<form action={formAction} class='center'>
			<InputWithOverlay name='gtin' id='gtin-input' value={gtin} placeholder='GTIN/EAN/UPC (Barcode)'>
				<SpriteIcon name='barcode' />
			</InputWithOverlay>
			<InputWithOverlay name='url' id='url-input' value={externalUrl} placeholder='Provider URL'>
				<SpriteIcon name='world-www' />
			</InputWithOverlay>
			<InputWithOverlay name='region' id='region-input' value={regions.join(',')} placeholder='Region (Country Code)'>
				<SpriteIcon name='world-pin' />
			</InputWithOverlay>
			<InputWithOverlay type='submit' value='Lookup'>
				<SpriteIcon name='search' />
			</InputWithOverlay>
			<ProviderCheckboxes enabledProviders={enabledProviders} />
		</form>
	);
}
