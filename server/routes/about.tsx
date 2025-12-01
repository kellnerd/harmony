import { providers } from '@/providers/mod.ts';
import { categoryDescriptions } from '@/providers/categories.ts';
import { FeatureQuality } from '@/providers/features.ts';
import { defaultRegions } from '@/server/state.ts';
import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';
import { Head } from 'fresh/runtime.ts';

export default function About() {
	return (
		<main>
			<Head>
				<title>About Harmony</title>
			</Head>
			<h2>Release Lookup Parameters</h2>
			<p>The Release Lookup page (and the Release Actions page) accept the following query parameters:</p>
			<dl>
				<dt>
					<code>url</code>
				</dt>
				<dd>
					Release URL from one of the supported providers. Can be specified multiple times to lookup multiple sources.
				</dd>
				<dt>
					<code>gtin</code>
				</dt>
				<dd>
					Barcode (GTIN, EAN or UPC) of the release. Can be specified instead of or in addition to <code>url</code>.
				</dd>
				<dt>
					<code>region</code>
				</dt>
				<dd>
					<a href='https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2'>ISO 3166-1 alpha-2</a>{' '}
					country code for providers with region-specific pages or API. Multiple values can be specified as fallbacks.
					The default regions ({defaultRegions.join(', ')}) can be changed in the settings.
				</dd>
				<dt>
					<code>category</code>
				</dt>
				<dd>
					Category of the (additional) providers which should be looked up by barcode. Supported values:
					<dl>
						{Object.entries(categoryDescriptions).map(([category, description]) => (
							<>
								<dt>
									<code>{category}</code>
								</dt>
								<dd>
									{description} Includes: {providers.filterInternalNamesByCategory(category).join(', ') || '?'}
								</dd>
							</>
						))}
					</dl>
				</dd>
			</dl>
			<p>
				In addition to the predefined categories, any provider can be added to the combined lookup by appending its
				internal name as a query parameter without value (or even with a release ID as value).
			</p>
			<h2>Supported Providers</h2>
			<table>
				<tr>
					<th></th>
					<th>Display Name</th>
					<th>Internal Name</th>
					<th colspan={2}>Supported URL Formats</th>
					<th>Barcode Lookup</th>
				</tr>
				{providers.displayNames.map((name) => {
					const provider = providers.findByName(name)!;
					return (
						<tr>
							<td class={['provider-icon', provider.internalName].join(' ')}>
								<ProviderIcon providerName={name} />
							</td>
							<td>
								{name}
							</td>
							<td>
								<code>{provider.internalName}</code>
							</td>
							<td>
								<code>{provider.supportedUrls.hostname}</code>
							</td>
							<td>
								<code>{provider.supportedUrls.pathname}</code>
							</td>
							<td class='center'>{provider.getQuality('GTIN lookup') > FeatureQuality.UNKNOWN ? '✓' : '✗'}</td>
						</tr>
					);
				})}
			</table>
			<p>
				Supported URL formats are specified using the{' '}
				<a href='https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API'>
					URL Pattern API
				</a>
			</p>
		</main>
	);
}
