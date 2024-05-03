import { ArtistCredit } from './ArtistCredit.tsx';
import { CoverImage } from './CoverImage.tsx';
import { LinkedEntity } from './LinkedEntity.tsx';
import { MessageBox } from './MessageBox.tsx';
import { ProviderIcon } from './ProviderIcon.tsx';
import { TextWithLineBreaks } from './TextWithLineBreaks.tsx';
import { Tracklist } from './Tracklist.tsx';
import RegionList from '@/server/islands/RegionList.tsx';

import { determineReleaseEventCountries } from '@/musicbrainz/release_countries.ts';
import { formatPartialDate } from '@/utils/date.ts';
import { formatLanguageConfidence, formatScriptFrequency, regionName } from '@/utils/locale.ts';
import { flagEmoji } from '@/utils/regions.ts';
import { formatTimestampAsISOString } from '@/utils/time.ts';

import type { HarmonyRelease } from '@/harmonizer/types.ts';

export function Release({ release }: { release: HarmonyRelease }) {
	const regions = release.availableIn;
	const excludedRegions = release.excludedFrom;
	const releaseCountries = determineReleaseEventCountries(release);
	const isMultiMedium = release.media.length > 1;
	const { credits, copyright, language, script, info } = release;

	return (
		<div class='release'>
			{info.messages.map((message) => <MessageBox message={message} />)}
			<h2 class='release-title'>{release.title}</h2>
			<p class='release-artist'>
				by <ArtistCredit artists={release.artists} />
			</p>
			<table class='release-info'>
				<tr>
					<th>Providers</th>
					<td>
						<ul>
							{info.providers.map((provider) => (
								<li>
									<ProviderIcon providerName={provider.name} size={20} stroke={1.5} />
									{provider.name}: <a href={provider.url.href} target='_blank'>{provider.id}</a>
									{provider.apiUrl && <a class='label ml-2' href={provider.apiUrl.href} target='_blank'>API</a>}
									{provider.cacheTime && (
										<span class='label ml-2'>Cached: {formatTimestampAsISOString(provider.cacheTime)}</span>
									)}
									{provider.processingTime && <span class='label ml-2'>{provider.processingTime.toFixed(0)} ms</span>}
								</li>
							))}
						</ul>
					</td>
				</tr>
				<tr>
					<th>Release date</th>
					<td>{formatPartialDate(release.releaseDate ?? {}) || '[unknown]'}</td>
				</tr>
				{release.labels && (
					<tr>
						<th>Labels</th>
						<td>
							<ul>
								{release.labels?.map((label) => (
									<li>
										<LinkedEntity entity={label} entityType='label' displayName={label.name} />
										{label.catalogNumber}
									</li>
								))}
							</ul>
						</td>
					</tr>
				)}
				<tr>
					<th>
						<abbr title='Global Trade Item Number'>GTIN</abbr>
					</th>
					<td>{release.gtin || '[unknown]'}</td>
				</tr>
				<tr>
					<th>External links</th>
					<td>
						<ul>
							{release.externalLinks.map((link) => (
								<li>
									<a href={link.url.href}>{link.url.hostname}</a>
									{link.types?.map((type) => <span class='label ml-1'>{type}</span>)}
								</li>
							))}
						</ul>
					</td>
				</tr>
				{regions && (
					<tr>
						<th>Availability</th>
						<td>
							<RegionList regions={regions} />
						</td>
					</tr>
				)}
				{excludedRegions && (
					<tr>
						<th>Unavailability</th>
						<td>
							<RegionList regions={excludedRegions} />
						</td>
					</tr>
				)}
				{releaseCountries && (
					<tr>
						<th>Release events</th>
						<td>
							<ul>
								{releaseCountries.map((code) => (
									<li>
										{flagEmoji(code)} {regionName(code)}
									</li>
								))}
							</ul>
						</td>
					</tr>
				)}
				{copyright && (
					<tr>
						<th>Copyright</th>
						<td>
							<TextWithLineBreaks lines={copyright.split('\n')} />
						</td>
					</tr>
				)}
				{credits && (
					<tr>
						<th>Credits</th>
						<td>
							<TextWithLineBreaks lines={credits.split('\n')} />
						</td>
					</tr>
				)}
				{language && (
					<tr>
						<th>Language</th>
						<td>{formatLanguageConfidence(language)}</td>
					</tr>
				)}
				{script && (
					<tr>
						<th>Script</th>
						<td>{formatScriptFrequency(script)}</td>
					</tr>
				)}
				{info.providers.length > 1 && (
					<tr>
						<th>Sources</th>
						<td>
							<ul>
								{Object.entries(info.sourceMap!).map(([property, source]) => <li>{property}: {source}</li>)}
							</ul>
						</td>
					</tr>
				)}
			</table>
			{release.images?.map((artwork) => <CoverImage artwork={artwork} />)}
			{release.media.map((medium) => <Tracklist medium={medium} showTitle={isMultiMedium} />)}
		</div>
	);
}
