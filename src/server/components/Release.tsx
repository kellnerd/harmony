import { ArtistCredit } from './ArtistCredit.tsx';
import { CoverImage } from './CoverImage.tsx';
import { Tracklist } from './Tracklist.tsx';
import { formatPartialDate } from '../../utils/date.ts';

import type { HarmonyRelease } from '../../harmonizer/types.ts';

export function Release(release: HarmonyRelease) {
	return (
		<div class='release'>
			<h2>{release.title}</h2>
			<p>
				by <ArtistCredit artists={release.artists} />
			</p>
			<table>
				<tr>
					<th>Release date</th>
					<td>{formatPartialDate(release.releaseDate) || '????'}</td>
				</tr>
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
				<tr>
					<th>
						<abbr title='Global Trade Item Number'>GTIN</abbr>
					</th>
					<td>{release.gtin}</td>
				</tr>
				<tr>
					<th>External links</th>
					<td>
						<ul>
							{release.externalLinks.map((link) => (
								<li>
									<a href={link.href}>{link.hostname}</a>
								</li>
							))}
						</ul>
					</td>
				</tr>
			</table>
			{release.images?.map((artwork) => <CoverImage artwork={artwork} />)}
			{release.media.map((medium) => <Tracklist medium={medium} />)}
			<pre>{JSON.stringify(release, null, 2)}</pre>
		</div>
	);
}
