import { CountryCode } from '../harmonizer/types.ts';

/** Converts an ISO 3166-1 alpha-2 country code into an Unicode regional indicator symbol (flag emoji). */
export function flagEmoji(code: CountryCode) {
	code = code.toUpperCase();

	// map special codes which are used by MusicBrainz
	if (code === 'XW') code = 'UN';
	else if (code === 'XE') code = 'EU';

	return String.fromCodePoint(...[...code].map((c) => c.charCodeAt(0) + 0x1F1A5));
}
