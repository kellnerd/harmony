import type { ArtistCreditName } from '@/harmonizer/types.ts';
import { LinkedEntity } from '@/server/components/LinkedEntity.tsx';

export function ArtistCredit({ artists, plainText = false }: { artists: ArtistCreditName[]; plainText?: boolean }) {
	const lastIndex = artists.length - 1;

	return (
		<span class='artist-credit'>
			{artists.map((artist, index) => {
				const displayName = artist.creditedName ?? artist.name ?? '[unknown]';
				return (
					<>
						{plainText ? displayName : <LinkedEntity entity={artist} entityType='artist' displayName={displayName} />}
						{artist.joinPhrase ?? (index !== lastIndex && (index === lastIndex - 1 ? ' & ' : ', '))}
					</>
				);
			})}
		</span>
	);
}
