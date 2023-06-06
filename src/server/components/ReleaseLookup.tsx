import InputWithOverlay from './InputWithOverlay.tsx';
import IconBarcode from 'tabler-icons/barcode.tsx';
import IconWorldWww from 'tabler-icons/world-www.tsx';

import type { GTIN } from '../../harmonizer/types.ts';

export default function ReleaseLookup({ gtin, externalUrl }: {
	gtin?: GTIN | null;
	externalUrl?: string | null;
}) {
	return (
		<form>
			<div>
				<label for='gtin-input'>
					<abbr title='Global Trade Item Number'>GTIN</abbr>:
				</label>
				<InputWithOverlay type='text' name='gtin' id='gtin-input' value={gtin ?? ''}>
					<IconBarcode />
				</InputWithOverlay>
			</div>
			<div>
				<label for='url-input'>URL:</label>
				<InputWithOverlay type='text' name='url' id='url-input' value={externalUrl ?? ''}>
					<IconWorldWww />
				</InputWithOverlay>
			</div>
			<button type='submit'>Lookup</button>
		</form>
	);
}
