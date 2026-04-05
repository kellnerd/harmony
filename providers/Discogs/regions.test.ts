import type { CountryCode } from '@/harmonizer/types.ts';
import type { FunctionSpec } from '@/utils/test_spec.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';
import { convertCountryStringToCodes } from './regions.ts';

const countryTestCases: FunctionSpec<typeof convertCountryStringToCodes> = [
	['converts standard country name: Spain', 'Spain', ['ES']],
	['converts non-standard country name: Ivory Coast', 'Ivory Coast', ['CI']],
	['converts abbreviated country name: UK', 'UK', ['GB']],
	['converts abbreviated country name: US', 'US', ['US']],
	['supports special region: Worldwide', 'Worldwide', ['XW']],
	['supports special region: Europe', 'Europe', ['XE']],
	['supports historical region with ISO code: USSR', 'USSR', ['SU']],
	['ignores disputed region without ISO code', 'Tibet', undefined],
	['ignores continent', 'Africa', undefined],
	['ignores historical region without ISO code', 'Ottoman Empire', undefined],
];

const countryGroupTestCases: Record<string, CountryCode[] | undefined> = {
	'Africa': undefined, // too many
	'Asia': undefined, // too many
	'Australasia': ['AU', 'NZ', 'PG'],
	'Australia & New Zealand': ['AU', 'NZ'],
	'Benelux': ['BE', 'NL', 'LU'],
	'Central America': ['BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA'],
	'Czech Republic & Slovakia': ['CZ', 'SK'],
	'France & Benelux': ['FR', 'BE', 'NL', 'LU'],
	'Germany & Switzerland': ['DE', 'CH'],
	'Germany, Austria, & Switzerland': ['DE', 'AT', 'CH'],
	'Gulf Cooperation Council': ['AE', 'BA', 'KW', 'OM', 'QA', 'SA'],
	'Hong Kong & Thailand': ['HK', 'TH'],
	'Middle East': undefined, // too many
	'North America (inc Mexico)': ['CA', 'MX', 'US'],
	'North & South America': undefined, // too many
	'Russia & CIS': ['RU', 'AM', 'AZ', 'BY', 'GE', 'KG', 'KZ', 'MD', 'TJ', 'TM', 'UA', 'UZ'],
	'Scandinavia': ['DK', 'NO', 'SE'],
	'Singapore & Malaysia': ['SG', 'MY'],
	'Singapore, Malaysia & Hong Kong': ['SG', 'MY', 'HK'],
	'Singapore, Malaysia, Hong Kong & Thailand': ['SG', 'MY', 'HK', 'TH'],
	'South America': ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'],
	'South East Asia': ['BN', 'ID', 'KH', 'LA', 'MM', 'MY', 'PH', 'SG', 'TH', 'TL', 'VN'],
	'South Pacific': ['FJ', 'SB', 'TO', 'TV', 'VU', 'WS'],
	'UK & Europe': ['GB', 'XE'],
	'UK, Europe & Israel': ['GB', 'XE', 'IL'],
	'UK, Europe & Japan': ['GB', 'XE', 'JP'],
	'UK, Europe & US': ['GB', 'XE', 'US'],
	'UK & France': ['GB', 'FR'],
	'UK & Germany': ['GB', 'DE'],
	'UK & Ireland': ['GB', 'IE'],
	'UK & US': ['GB', 'US'],
	'USA & Canada': ['US', 'CA'],
	'USA & Europe': ['US', 'XE'],
	'USA, Canada & Europe': ['US', 'CA', 'XE'],
	'USA, Canada & UK': ['US', 'CA', 'GB'],
};

describe('convertCountryStringToCodes', () => {
	for (const [description, country, codes] of countryTestCases) {
		it(description, () => assertEquals(convertCountryStringToCodes(country), codes));
	}

	for (const [group, codes] of Object.entries(countryGroupTestCases)) {
		it(`${codes ? 'supports' : 'ignores'} the combination ${group}`, () => {
			assertEquals(convertCountryStringToCodes(group), codes);
		});
	}
});
