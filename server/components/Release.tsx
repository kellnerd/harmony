import { setupAlternativeValues } from './AlternativeValues.tsx';
import { ArtistCredit } from './ArtistCredit.tsx';
import { CoverImage } from './CoverImage.tsx';
import { MessageBox } from './MessageBox.tsx';
import { ProviderList } from './ProviderList.tsx';
import { ReleaseLabels } from './ReleaseLabels.tsx';
import { TextWithLineBreaks } from './TextWithLineBreaks.tsx';
import { Tracklist } from './Tracklist.tsx';
import { CopyButton, CopyLinksButton } from '@/server/islands/CopyButton.tsx';
import RegionList from '@/server/islands/RegionList.tsx';

import { determineReleaseEventCountries } from '@/musicbrainz/release_countries.ts';
import { formatPartialDate } from '@/utils/date.ts';
import { formatLanguageConfidence, formatScriptFrequency, regionName } from '@/utils/locale.ts';
import { mapValues } from '@/utils/record.ts';
import { flagEmoji } from '@/utils/regions.ts';

import type { HarmonyRelease, ProviderReleaseMap } from '@/harmonizer/types.ts';

export function Release({ release, releaseMap }: { release: HarmonyRelease; releaseMap?: ProviderReleaseMap }) {
	const regions = release.availableIn;
	const excludedRegions = release.excludedFrom;
	const releaseCountries = determineReleaseEventCountries(release);
	const { credits, copyright, labels, language, script, types, info } = release;

	const AlternativeValues = setupAlternativeValues(releaseMap);

	return (
		<div class='release'>
			{info.messages.map((message) => <MessageBox message={message} />)}
			<h2 class='release-title'>{release.title}</h2>
			<AlternativeValues property={(release) => release.title} />
			<div class='release-artist'>
				by <ArtistCredit artists={release.artists} />
			</div>
			<AlternativeValues
				property={(release) => release.artists}
				display={(artists) => <ArtistCredit artists={artists} />}
				identifier={(artists) => artists.map((artist) => artist.creditedName ?? artist.name).join('\n')}
			/>
			<table class='release-info'>
				<tr>
					<th>Providers</th>
					<td>
						<ProviderList providers={info.providers} />
					</td>
				</tr>
				<tr>
					<th>Release date</th>
					<td>
						{formatPartialDate(release.releaseDate ?? {}) || '[unknown]'}
						<AlternativeValues
							property={(release) => release.releaseDate}
							display={formatPartialDate}
							identifier={formatPartialDate}
						/>
					</td>
				</tr>
				{labels && labels.length > 0 && (
					<tr>
						<th>Labels</th>
						<td>
							<ReleaseLabels labels={labels} />
							<AlternativeValues
								property={(release) => release.labels}
								display={(labels) => <ReleaseLabels labels={labels} inline />}
								identifier={(labels) =>
									labels.map(
										({ name, catalogNumber }) => [name, catalogNumber].join('\t'),
									).join('\n')}
							/>
						</td>
					</tr>
				)}
				<tr>
					<th>
						<abbr title='Global Trade Item Number'>GTIN</abbr>
					</th>
					<td>
						{release.gtin || '[unknown]'}
						{release.gtin && <CopyButton content={release.gtin.toString()} />}
					</td>
				</tr>
				<tr>
					<th>External links</th>
					<td>
						<CopyLinksButton links={release.externalLinks} />
						<ul>
							{release.externalLinks.map((link) => (
								<li>
									<a href={link.url}>{new URL(link.url).hostname}</a>
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
							<AlternativeValues
								property={(release) => release.copyright}
								display={(copyright) => <TextWithLineBreaks lines={copyright.split('\n')} />}
							/>
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
				{types && types.length > 0 && (
					<tr>
						<th>Types</th>
						<td>
							{types.join(' + ')}
							<AlternativeValues
								property={(release) => release.types}
								display={(types) => types.join(' + ') || '[none]'}
							/>
						</td>
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
			{release.media.map((medium, index) => (
				<Tracklist
					medium={medium}
					mediumMap={releaseMap && mapValues(releaseMap, (release) => release.media[index])}
					showTitle={true}
				/>
			))}
		</div>
	);
}
