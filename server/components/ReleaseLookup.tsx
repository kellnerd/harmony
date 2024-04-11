import InputWithOverlay from './InputWithOverlay.tsx';
import IconBarcode from 'tabler-icons/barcode.tsx';
import IconSearch from 'tabler-icons/search.tsx';
import IconWorldWww from 'tabler-icons/world-www.tsx';

import type { GTIN } from '@/harmonizer/types.ts';

export default function ReleaseLookup({ gtin, externalUrl, formAction = '' }: {
	gtin?: GTIN | null;
	externalUrl?: string | null;
	formAction?: string;
}) {
	return (
		<form action={formAction} class='center'>
			<InputWithOverlay type='text' name='gtin' id='gtin-input' value={gtin ?? ''} placeholder='GTIN/EAN/UPC (Barcode)'>
				<IconBarcode />
			</InputWithOverlay>
			<strong>or</strong>
			<InputWithOverlay type='text' name='url' id='url-input' value={externalUrl ?? ''} placeholder='Provider URL'>
				<IconWorldWww />
			</InputWithOverlay>
			<InputWithOverlay type='submit' value='Lookup'>
				<IconSearch />
			</InputWithOverlay>
		</form>
	);
}
