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
				<input type='text' name='gtin' id='gtin-input' value={gtin ?? ''} />
			</div>
			<div>
				<label for='url-input'>URL:</label>
				<input type='text' name='url' id='url-input' value={externalUrl ?? ''} />
			</div>
			<button type='submit'>Lookup</button>
		</form>
	);
}
