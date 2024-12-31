import { matchBySimilarName, similarNames } from './similarity.ts';

import { describe, it } from 'std/testing/bdd.ts';
import { assert } from 'std/assert/assert.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
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

describe('matchBySimilarName', () => {
	const names = ['Test 123', undefined, 'John Smith'];
	const items = names.map((name, index) => ({ name, index }));

	it('finds the first item with the same name', () => {
		const namedItems = ['Test 123', 'John Smith', 'Jane Doe', 'John Smith'].map((name, index) => ({ name, index }));
		assertEquals(
			matchBySimilarName(namedItems[1], namedItems, (item) => item.name),
			namedItems[1],
		);
	});

	it('handles candidate items without name', () => {
		assertEquals(
			matchBySimilarName(items[2], items, (item) => item.name),
			items[2],
		);
	});

	it('returns undefined when no item was found', () => {
		assertEquals(
			matchBySimilarName({ name: 'Test 456', index: 456 }, items, (item) => item.name),
			undefined,
		);
	});

	it('returns undefined when the main item has no name', () => {
		assertEquals(
			matchBySimilarName(items[1], items, (item) => item.name),
			undefined,
		);
	});

	describe('matching uses the same similarity algorithm as similarNames', () => {
		similarCases.forEach(([description, a, b]) => {
			it(`treats ${description} as similar`, () => {
				const mainItem = { name: a, index: 42 };
				const candidateItem = { name: b, index: 43 };
				assertEquals(
					matchBySimilarName(mainItem, items.concat(candidateItem), (item) => item.name),
					candidateItem,
				);
			});
		});

		dissimilarCases.forEach(([description, a, b]) => {
			it(`treats ${description} as not similar`, () => {
				const mainItem = { name: a, index: 42 };
				const candidateItem = { name: b, index: 43 };
				assertEquals(
					matchBySimilarName(mainItem, items.concat(candidateItem), (item) => item.name),
					undefined,
				);
			});
		});
	});
});
