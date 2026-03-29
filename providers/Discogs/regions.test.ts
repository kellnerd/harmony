import type { FunctionSpec } from '@/utils/test_spec.ts';
import { describe, it } from '@std/testing/bdd';
import { convertCountryStringToCodes } from './regions.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';

const countryTestCases: FunctionSpec<typeof convertCountryStringToCodes> = [
	['converts standard country name: Spain', 'Spain', ['ES']],
	['converts non-standard country name: Ivory Coast', 'Ivory Coast', ['CI']],
	['converts abbreviated country name: UK', 'UK', ['GB']],
	['converts abbreviated country name: US', 'US', ['US']],
	['handles special region: Worldwide', 'Worldwide', ['XW']],
	['handles special region: Europe', 'Europe', ['XE']],
	['handles historical region with ISO code: USSR', 'USSR', ['SU']],
	['fails for disputed region without ISO code', 'Tibet', undefined],
	['fails for continent', 'Africa', undefined],
	['fails for combination of two country names', 'Australia & New Zealand', undefined],
	['fails for combination of three country names', 'Germany, Austria, & Switzerland', undefined],
	['fails for combination of three regions', 'UK, Europe & Japan', undefined],
	['fails for historical region without ISO code: USSR', 'Ottoman Empire', undefined],
];

describe('convertCountryStringToCodes', () => {
	for (const [description, country, codes] of countryTestCases) {
		it(description, () => assertEquals(convertCountryStringToCodes(country), codes));
	}
});
