import { MessageBox } from '@/server/components/MessageBox.tsx';
import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';

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
				<MessageBox
					message={{
						type: 'info',
						text: `
1. Enter a release URL for one of the supported providers and/or a barcode.
2. Select (additional) providers which should be looked up by barcode.
3. Optionally specify a country code (two letters) for providers with region-specific pages.
						`,
					}}
				/>
				<h2 class='center'>Release Lookup</h2>
				<ReleaseLookup formAction='release' />
			</main>
		</>
	);
}
