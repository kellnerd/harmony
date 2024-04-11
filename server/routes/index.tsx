import Footer from '../components/Footer.tsx';
import { MessageBox } from '../components/MessageBox.tsx';
import ReleaseLookup from '../components/ReleaseLookup.tsx';

import { providerNames } from '../../providers/mod.ts';

export default function Home() {
	return (
		<>
			<header class='center'>
				<h1>Harmony</h1>
				<p class='subtitle'>Music Metadata Aggregator and MusicBrainz Importer</p>
			</header>
			<main>
				<MessageBox message={{ text: `Supported providers: ${providerNames.join(', ')}`, type: 'info' }} />
				<h2 class='center'>Release Lookup</h2>
				<ReleaseLookup formAction='release' />
			</main>
			<Footer />
		</>
	);
}
