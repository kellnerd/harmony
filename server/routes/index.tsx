import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';
import { Tooltip } from '@/server/components/Tooltip.tsx';

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
				<h2 class='center'>
					Release Lookup{' '}
					<Tooltip style={{ width: '25rem' }}>
						<ol>
							<li>Enter a release URL for one of the supported providers and/or a barcode.</li>
							<li>Optionally specify a country code	(two letters) for providers with region-specific pages.</li>
							<li>Select (additional) providers which should be looked up by barcode.</li>
						</ol>
					</Tooltip>
				</h2>
				<ReleaseLookup formAction='release' />
			</main>
		</>
	);
}
