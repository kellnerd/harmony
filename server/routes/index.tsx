import ReleaseLookup from '@/server/components/ReleaseLookup.tsx';
import { Tooltip } from '@/server/components/Tooltip.tsx';
import IconBrandDiscogs from '@/server/icons/BrandDiscogs.tsx';
import IconBrandMetaBrainz from '@/server/icons/BrandMetaBrainz.tsx';
import IconBrandMetaBrainzFilled from '@/server/icons/BrandMetaBrainzFilled.tsx';
import IconBrandApple from 'tabler-icons/brand-apple.tsx';
import IconBrandApplePodcast from 'tabler-icons/brand-apple-podcast.tsx';
import IconBrandBandcamp from 'tabler-icons/brand-bandcamp.tsx';
// new Deezer heart icon: #a238ff
import IconBrandDeezer from 'tabler-icons/brand-deezer.tsx';
import IconBrandSpotify from 'tabler-icons/brand-spotify.tsx';

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
				<p class='center'>
					<IconBrandMetaBrainz alt='Monochrome Brainz' />
					<IconBrandMetaBrainzFilled alt='Monochrome Brainz' />
					<IconBrandMetaBrainz color='#5aa854' alt='MetaBrainz' />
					<IconBrandMetaBrainzFilled color='#5aa854' alt='MetaBrainz' />
					<IconBrandMetaBrainz color='#ba478f' alt='MusicBrainz' />
					<IconBrandMetaBrainzFilled color='#ba478f' alt='MusicBrainz' />
					<IconBrandDeezer color='#00c7f2' />
					<IconBrandApplePodcast color='#872ec4' />
					<IconBrandApple color='#fc3c44' />
					<IconBrandSpotify color='#1db954' />
					<IconBrandBandcamp color='#1da0c3' />
					<IconBrandDiscogs />
				</p>
				<ReleaseLookup formAction='release' />
			</main>
		</>
	);
}
