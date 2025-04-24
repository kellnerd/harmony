import { providers } from '@/providers/mod.ts';
import { FeatureQuality } from '@/providers/features.ts';
import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';
import { Head } from 'fresh/runtime.ts';

export default function About() {
	return (
		<main>
			<Head>
				<title>About Harmony</title>
			</Head>
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
