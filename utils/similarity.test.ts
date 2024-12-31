import { similarNames } from './similarity.ts';

import { describe, it } from 'std/testing/bdd.ts';
import { assert } from 'std/assert/assert.ts';
import { assertFalse } from 'std/assert/assert_false.ts';

import type { ParameterSpec } from './test_spec.ts';

const similarCases: ParameterSpec<typeof similarNames> = [
	['equal name', 'Jane Doe', 'Jane Doe'],
	['lowercase name', 'jane doe', 'Jane Doe'],
	['uppercase name', 'JANE DOE', 'Jane Doe'],
	['name with umlauts', 'Jäne Döe', 'Jane Doe'],
	['name with accents', 'Janè Dôe', 'Jane Doe'],
	['name with hyphen', 'Jane-Doe', 'Jane Doe'],
	['abbreviation with and without dots', 'J.A.N.E. Doe', 'JANE Doe'],
	['quoted name and unquoted name', '"Jane" Doe', 'Jane Doe'],
];

const dissimilarCases: ParameterSpec<typeof similarNames> = [
	['different name', 'John Doe', 'Jane Doe'],
	['abbreviated name', 'J. Doe', 'Jane Doe'],
];

describe('similarNames', () => {
	similarCases.forEach(([description, a, b]) => {
		it(`treats ${description} as similar`, () => {
			assert(similarNames(a, b));
		});
	});

	dissimilarCases.forEach(([description, a, b]) => {
		it(`treats ${description} as not similar`, () => {
			assertFalse(similarNames(a, b));
		});
	});
});
