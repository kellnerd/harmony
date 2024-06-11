const isrcPattern = /^([A-Z]{2})-?([A-Z0-9]{3})-?(\d{2})-?(\d{5})$/i;

export function ISRC({ code }: { code: string }) {
	const codeMatch = code.trim().match(isrcPattern);

	return codeMatch
		? (
			<code class='isrc'>
				<span class='country'>{codeMatch[1]}</span>
				<span class='registrant'>{codeMatch[2]}</span>
				<span class='year'>{codeMatch[3]}</span>
				<span class='designation'>{codeMatch[4]}</span>
			</code>
		)
		: <code class='invalid-isrc'>{code}</code>;
}
