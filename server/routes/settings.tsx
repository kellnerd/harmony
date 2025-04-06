import { Tooltip } from '@/server/components/Tooltip.tsx';
import { PersistentTextInput } from '@/server/islands/PersistentInput.tsx';

export default function Settings() {
	return (
		<main>
			<h2>Settings</h2>
			<h3>Importer Behavior</h3>
			<div class='row'>
				<label for='seeder.target'>Seeder target:</label>
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
				<PersistentTextInput name='seeder.target' id='seeder.target' initialValue='_blank' />
			</div>
		</main>
	);
}
