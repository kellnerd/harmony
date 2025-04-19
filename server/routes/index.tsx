import { MBIDInput } from '@/server/components/MBIDInput.tsx';
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
			<main class='center'>
				<h2>
					Release Lookup{' '}
					<Tooltip style={{ width: '25rem' }}>
						<ol>
							<li>Enter a release URL for one of the supported providers and/or a barcode.</li>
							<li>Optionally specify a country code	(two letters) for providers with region-specific pages.</li>
							<li>Select (additional) providers which should be looked up by barcode.</li>
						</ol>
					</Tooltip>
				</h2>
				<p>
					Look up a release from the <a href='about'>supported metadata providers</a> and import it into MusicBrainz.
				</p>
				<ReleaseLookup formAction='release' />
				<hr />
				<h2>Release Actions</h2>
				<p>Submit additional data like cover art and ISRCs for a MusicBrainz release.</p>
				<p>Link external IDs (URLs) of related artists, labels and recordings to MusicBrainz.</p>
				<form action='release/actions' class='center'>
					<div class='row'>
						<MBIDInput name='release_mbid' placeholder='MusicBrainz release URL or MBID' />
						<input type='submit' value='Go!' />
					</div>
				</form>
			</main>
		</>
	);
}
