import { MessageBox } from '../components/MessageBox.tsx';
import ReleaseLookup from '../components/ReleaseLookup.tsx';

import { providerNames } from '../../providers.ts';
import { Head } from 'fresh/runtime.ts';

export default function Home() {
	return (
		<>
			<Head>
				<title>Harmony</title>
				<link rel='stylesheet' href='harmony.css' />
			</Head>
			<header class='center'>
				<h1>Harmony</h1>
				<p class='subtitle'>Music Metadata Aggregator and MusicBrainz Importer</p>
			</header>
			<MessageBox message={{ text: `Supported providers: ${providerNames.join(', ')}`, type: 'info' }} />
			<h2 class='center'>Release Lookup</h2>
			<ReleaseLookup formAction='release' />
		</>
	);
}
