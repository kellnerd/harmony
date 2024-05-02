import type { ArtistCreditName } from '@/harmonizer/types.ts';
import { LinkedEntity } from '@/server/components/LinkedEntity.tsx';

export function ArtistCredit({ artists }: { artists: ArtistCreditName[] }) {
	return (
		<span class='artist-credit'>
			{artists.map((artist, index) => (
				<>
					<LinkedEntity entity={artist} entityType='artist' displayName={artist.creditedName ?? artist.name} />
					{artist.joinPhrase ?? (index === artists.length - 1) ? '' : ', '}
				</>
			))}
		</span>
	);
}
