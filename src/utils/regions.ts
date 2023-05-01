import { CountryCode } from '../harmonizer/types.ts';

const regionNames = new Intl.DisplayNames('en', {
	type: 'region',
});

/** Gets the English display name for the region of an ISO 3166-1 alpha-2 country code. */
export function regionName(code: CountryCode) {
	code = code.toUpperCase();

	// handle special codes which are used by MusicBrainz
	if (code === 'XW') return '[Worldwide]';
	else if (code === 'XE') return 'Europe';

	return regionNames.of(code);
}

/** Converts an ISO 3166-1 alpha-2 country code into an Unicode regional indicator symbol (flag emoji). */
export function flagEmoji(code: CountryCode) {
	code = code.toUpperCase();

	// map special codes which are used by MusicBrainz
	if (code === 'XW') code = 'UN';
	else if (code === 'XE') code = 'EU';

	return String.fromCodePoint(...[...code].map((c) => c.charCodeAt(0) + 0x1F1A5));
}
