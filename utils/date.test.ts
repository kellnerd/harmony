import { parseGermanDate } from './date.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';

import type { FunctionSpec } from './test_spec.ts';

describe('parseGermanDate', () => {
	const testCases: FunctionSpec<typeof parseGermanDate> = [
		['parses a full date', '27. Februar 2025', { day: 27, month: 2, year: 2025 }],
		['handles padded day', '01. Juli 2004', { day: 1, month: 7, year: 2004 }],
		['parses a month name and year', 'Dezember 1999', { day: undefined, month: 12, year: 1999 }],
		['parses a year', '1973', { day: undefined, month: undefined, year: 1973 }],
		['handles umlauts in month names', '9. März 1984', { day: 9, month: 3, year: 1984 }],
		['handles date with trailing text', '6. Juni 2025 (heute)', { day: 6, month: 6, year: 2025 }],
	];

	testCases.forEach(([description, input, expected]) => {
		it(description, () => {
			assertEquals(parseGermanDate(input), expected);
		});
	});
});
