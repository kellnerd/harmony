import { musicbrainzTargetServer } from '@/config.ts';
import { ISRC as ParsedISRC } from '@/harmonizer/isrc.ts';
import { join } from 'std/url/join.ts';
import { ProviderIcon } from './ProviderIcon.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

export function ISRC({ code }: { code: string }) {
	try {
		const isrc = new ParsedISRC(code);
		const normalizedCode = isrc.toString();

		return (
			<>
				<span class='entity-links'>
					<a
						title='ifpi ISRC search'
						href={`https://isrcsearch.ifpi.org/?tab=code&isrcCode=${normalizedCode}&itemsPerPage=100&showReleases=true`}
					>
						<SpriteIcon size={18} name='brand-ifpi' stroke={1.5} />
					</a>
					<a href={join(musicbrainzTargetServer, 'isrc', normalizedCode).href}>
						<ProviderIcon providerName='MusicBrainz' size={18} stroke={1.5} />
					</a>
				</span>
				<code class='isrc'>
					<span class='country'>{isrc.country}</span>
					<span class='registrant'>{isrc.registrant}</span>
					<span class='year'>{isrc.year}</span>
					<span class='designation'>{isrc.designation}</span>
				</code>
			</>
		);
	} catch {
		return <code class='invalid-isrc'>{code}</code>;
	}
}
