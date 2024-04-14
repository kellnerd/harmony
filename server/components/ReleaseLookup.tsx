import InputWithOverlay from './InputWithOverlay.tsx';
import IconBarcode from 'tabler-icons/barcode.tsx';
import IconSearch from 'tabler-icons/search.tsx';
import IconWorldPin from 'tabler-icons/world-pin.tsx';
import IconWorldWww from 'tabler-icons/world-www.tsx';

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
				<IconBarcode />
			</InputWithOverlay>
			<InputWithOverlay name='url' id='url-input' value={externalUrl} placeholder='Provider URL'>
				<IconWorldWww />
			</InputWithOverlay>
			<InputWithOverlay name='region' id='region-input' value={regions.join(',')} placeholder='Region (Country Code)'>
				<IconWorldPin />
			</InputWithOverlay>
			<InputWithOverlay type='submit' value='Lookup'>
				<IconSearch />
			</InputWithOverlay>
		</form>
	);
}
