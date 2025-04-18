import { defaultProviders } from '@/providers/mod.ts';
import { ProviderCheckboxes } from '@/server/components/ProviderInput.tsx';
import { CheckboxSettingRow, TextSettingRow } from '@/server/components/SettingRow.tsx';
import { Tooltip } from '@/server/components/Tooltip.tsx';
import { PersistentTextInput } from '@/server/islands/PersistentInput.tsx';
import { defaultRegions } from '@/server/state.ts';

export default function Settings() {
	return (
		<main>
			<h2>Settings</h2>
			<h3>Lookup Defaults</h3>
			<p>Providers which should be looked up by barcode:</p>
			<ProviderCheckboxes enabledProviders={defaultProviders} persistent />
			<p>
				Some providers only do lookups for a specific region. Specify the region which should be tried if the looked up
				URL doesn’t already contain a region.
			</p>
			<div class='row'>
				<label class='col' for='region-input'>Region:</label>
				<Tooltip>
					<a href='https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2'>ISO 3166-1 alpha-2</a>{' '}
					country codes (comma-separated)
				</Tooltip>
				<PersistentTextInput
					name='region'
					id='region-input'
					namespace='persist'
					initialValue={defaultRegions.join(',')}
					useCookie
				/>
			</div>
			<h3>Annotation Content</h3>
			<p>Select additional information which can’t be imported directly and should be added to the annotation.</p>
			<CheckboxSettingRow name='annotation.copyright' label='Copyright lines' defaultValue={true} />
			<CheckboxSettingRow name='annotation.credits' label='Release credits' defaultValue={true} />
			<CheckboxSettingRow name='annotation.availability' label='Lists of available and excluded regions' />
			<h3>Importer Behavior</h3>
			<TextSettingRow name='seeder.target' label='Seeder target' defaultValue='_blank'>
				<Tooltip>
					Name of the <a href='https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#target'>target</a>{' '}
					browsing context of the import button:
					<ul>
						<li>
							<code>_blank</code> to open a new tab
						</li>
						<li>
							<code>_self</code> to use the same tab
						</li>
					</ul>
				</Tooltip>
			</TextSettingRow>
			<CheckboxSettingRow name='seeder.redirect' label='Redirect to Release Actions after import' defaultValue={true} />
		</main>
	);
}
