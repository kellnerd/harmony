import { ArtistCredit } from './ArtistCredit.tsx';
import { CoverImage } from './CoverImage.tsx';
import { MessageBox } from './MessageBox.tsx';
import { TextWithLineBreaks } from './TextWithLineBreaks.tsx';
import { Tracklist } from './Tracklist.tsx';
import RegionList from '../islands/RegionList.tsx';
import { determineReleaseEventCountries } from '../../MusicBrainz/releaseCountries.ts';
import { formatPartialDate } from '../../utils/date.ts';
import { formatLanguageConfidence, formatScriptFrequency, regionName } from '../../utils/locale.ts';
import { flagEmoji } from '../../utils/regions.ts';

import type { HarmonyRelease } from '../../harmonizer/types.ts';

export function Release({ release }: { release: HarmonyRelease }) {
	const regions = release.availableIn;
	const excludedRegions = release.excludedFrom;
	const releaseCountries = determineReleaseEventCountries(release);
	const isMultiMedium = release.media.length > 1;
	const { copyright, language, script, info } = release;

	return (
		<div class='release'>
			<h2>{release.title}</h2>
			<p>
				by <ArtistCredit artists={release.artists} />
			</p>
			{info.messages.map((message) => <MessageBox message={message} />)}
			<table>
				<tr>
					<th>Providers</th>
					<td>
						<ul>
							{info.providers.map((provider) => (
								<li>
									{provider.name}: <a href={provider.url.href} target='_blank'>{provider.id}</a>
									{provider.apiUrl && (
										<>
											{' '}(<a href={provider.apiUrl.href} target='_blank'>API</a>)
										</>
									)}
								</li>
							))}
						</ul>
					</td>
				</tr>
				<tr>
					<th>Release date</th>
					<td>{formatPartialDate(release.releaseDate) || '[unknown]'}</td>
				</tr>
				{release.labels && (
					<tr>
						<th>Labels</th>
						<td>
							<ul>
								{release.labels?.map((label) => (
									<li>
										<a href={label.externalLink?.href}>{label.name}</a>
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
									{link.types && ` (${link.types.join(', ')})`}
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
			</table>
			{release.images?.map((artwork) => <CoverImage artwork={artwork} />)}
			{release.media.map((medium) => <Tracklist medium={medium} showTitle={isMultiMedium} />)}
		</div>
	);
}
