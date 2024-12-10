import { ProviderIcon } from '@/server/components/ProviderIcon.tsx';
import { join } from 'std/url/join.ts';

const isrcPattern = /^([A-Z]{2})-?([A-Z0-9]{3})-?(\d{2})-?(\d{5})$/i;

export function ISRC({ code }: { code: string }) {
	const codeMatch = code.trim().match(isrcPattern);

	return codeMatch
		? (
			<span>
				<span class='entity-links'>
					<a href={join('https://musicbrainz.org/isrc/', code).href}>
						<ProviderIcon providerName='MusicBrainz' size={18} stroke={1.5} />
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
