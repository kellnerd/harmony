import { checkDigit, isValidGTIN } from '../../src/utils/gtin.ts'

import { assert, assertFalse, assertStrictEquals } from 'std/testing/asserts.ts';
import { describe, it } from 'std/testing/bdd.ts';

import type { FunctionSpec, ParameterSpec } from '../spec.ts';

describe('GTIN validator', () => {
	const passingCases: ParameterSpec<typeof isValidGTIN> = [
		['numeric GTIN-14', 95135725845679],
		['string GTIN-14', '95135725845679'],
		['EAN-13', 5099902895529],
		['UPC-12', 731453463127],
		['UPC-12 with leading zero', '093624738626'],
	];

	const failingCases: ParameterSpec<typeof isValidGTIN> = [
		['numeric GTIN-14 with invalid check digit', 95135725845671],
		['string GTIN-14 with invalid check digit', '95135725845671'],
		['11 digit number which is a valid GTIN with leading zero', 93624738626],
	];

	passingCases.forEach(([description, input]) => {
		it(`passes for valid ${description}`, () => {
			assert(isValidGTIN(input));
		});
	});

	failingCases.forEach(([description, input]) => {
		it(`fails for ${description}`, () => {
			assertFalse(isValidGTIN(input));
		});
	});
});

describe('check digit calculation', () => {
	const cases: FunctionSpec<typeof checkDigit> = [
		['valid numeric GTIN-14', 95135725845679, 9],
		['valid string GTIN-14', '95135725845679', 9],
		['GTIN-14 with invalid check digit', 95135725845671, 9],
		['GTIN-14 with check digit placeholder', '9513572584567 ', 9],
	];

	cases.forEach(([description, input, expected]) => {
		it(`works for ${description}`, () => {
			assertStrictEquals(checkDigit(input), expected);
		});
	});
});
