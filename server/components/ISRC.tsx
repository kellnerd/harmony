import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';
import { join } from 'std/url/join.ts';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';
import { SpriteIconWidth } from '@/server/components/SpriteIconWidth.tsx';

const isrcPattern = /^([A-Z]{2})-?([A-Z0-9]{3})-?(\d{2})-?(\d{5})$/i;

export function ISRC({ code }: { code: string }) {
	const codeMatch = code.trim().match(isrcPattern);

	return codeMatch
		? (
			<span>
				<span class='entity-links'>
					<a href={join('https://musicbrainz.org/isrc/', code).href}>
						<ProviderIcon providerName='MusicBrainz' size={16} stroke={1.5} />
					</a>
					<a
						title='ifpi ISRC search'
						href={'https://isrcsearch.ifpi.org/?tab="code"&itemsPerPage=100&showReleases=true&isrcCode=' + code}
					>
						<SpriteIconWidth name='brand-ifpi' width={32} height={16} stroke={1.5} />
					</a>
				</span>
				<code class='isrc'>
					<span class='country'>{codeMatch[1]}</span>
					<span class='registrant'>{codeMatch[2]}</span>
					<span class='year'>{codeMatch[3]}</span>
					<span class='designation'>{codeMatch[4]}</span>
				</code>
			</span>
		)
		: <code class='invalid-isrc'>{code}</code>;
}
