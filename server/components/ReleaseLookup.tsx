import InputWithOverlay from './InputWithOverlay.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import type { GTIN } from '@/harmonizer/types.ts';

export default function ReleaseLookup({ gtin = '', externalUrl = '', regions = [], formAction = '' }: {
	gtin?: GTIN;
	externalUrl?: string;
	regions?: string[];
	formAction?: string;
}) {
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
		</form>
	);
}
