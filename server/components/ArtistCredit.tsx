import type { ArtistCreditName } from '../../harmonizer/types.ts';

export function ArtistCredit({ artists }: { artists: ArtistCreditName[] }) {
	return (
		<span class='artist-credit'>
			{artists.map((artist, index) => (
				<>
					<a href={artist.externalLink?.href}>{artist.creditedName ?? artist.name}</a>
					{artist.joinPhrase ?? (index === artists.length - 1) ? '' : ', '}
				</>
			))}
		</span>
	);
}
