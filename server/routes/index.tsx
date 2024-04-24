import { MessageBox } from '@/server/components/MessageBox.tsx';
import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';

import { allProviderNames } from '@/providers/mod.ts';

export default function Home() {
	return (
		<>
			<header class='center'>
				<h1>
					<img src='/harmony-logo.svg' class='banner-logo' alt='Logo' />
					<span>Harmony</span>
				</h1>
				<p class='subtitle'>Music Metadata Aggregator and MusicBrainz Importer</p>
			</header>
			<main>
				<MessageBox message={{ text: `Supported providers: ${allProviderNames.join(', ')}`, type: 'info' }} />
				<h2 class='center'>Release Lookup</h2>
				<ReleaseLookup formAction='release' />
			</main>
		</>
	);
}
