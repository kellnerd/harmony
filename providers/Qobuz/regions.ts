import type { CountryCode, LanguageCode } from '@/harmonizer/types.ts';

/**
 * Maps available regions to their available languages.
 *
 * @see https://help.qobuz.com/en/articles/10128-where-is-qobuz-available
 */
export const availableRegionsAndLanguages: Record<CountryCode, LanguageCode[] | undefined> = {
	// Argentina
	AR: ['es'],
	// Australia
	AU: ['en'],
	// Austria
	AT: ['de'],
	// Belgium
	BE: ['fr', 'nl'],
	// Brazil
	BR: ['pt'],
	// Canada
	CA: ['en', 'fr'],
	// Chile
	CL: ['es'],
	// Colombia
	CO: ['es'],
	// Denmark
	DK: ['en'],
	// Finland
	FI: ['en'],
	// France
	FR: ['fr'],
	// Germany
	DE: ['de'],
	// Ireland
	IE: ['en'],
	// Italy
	IT: ['it'],
	// Japan
	JP: ['ja'],
	// Luxembourg
	LU: ['de', 'fr'],
	// Netherlands
	NL: ['nl'],
	// Mexico
	MX: ['es'],
	// New Zealand
	NZ: ['en'],
	// Norway
	NO: ['en'],
	// Portugal
	PT: ['pt'],
	// Spain
	ES: ['es'],
	// Sweden
	SE: ['en'],
	// Switzerland
	CH: ['de', 'fr'],
	// United Kingdom
	GB: ['en'],
	// United States
	US: ['en'],
};

/**
 * Constructs a Qobuz URL locale from the given region and language.
 *
 * If no language is given, a default language for the region is used.
 */
export function makeLocale(region: CountryCode, language?: LanguageCode): string {
	if (!language) {
		language = availableRegionsAndLanguages[region.toUpperCase()]?.[0];
	}
	return [region.toLowerCase(), language ?? 'en'].join('-');
}
