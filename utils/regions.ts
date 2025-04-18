import { assert } from 'std/assert/assert.ts';
import type { CountryCode } from '@/harmonizer/types.ts';
import { regionName } from '@/utils/locale.ts';

/** Converts a country code into an Unicode regional indicator symbol (flag emoji). */
export function flagEmoji(code: CountryCode) {
	code = code.toUpperCase();

	// map special codes which are used by MusicBrainz
	if (code === 'XW') code = 'UN';
	else if (code === 'XE') code = 'EU';

	return String.fromCodePoint(...[...code].map((c) => c.charCodeAt(0) + 0x1F1A5));
}

/** Asserts tht the given country code has the correct format. */
export function assertCountryCode(code: CountryCode) {
	assert(code.length === 2, `'${code}' is not a valid ISO 3166-1 alpha-2 country code with two letters`);
}

/** Formats the given country codes as a human-readable, text-based region list. */
export function formatRegionList(regions: CountryCode[]) {
	return regions.map((code) => `${flagEmoji(code)} ${regionName(code)}`).join(', ');
}
