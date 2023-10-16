import { checkDigit, ensureValidGTIN, isEqualGTIN, isValidGTIN } from '../../src/utils/gtin.ts';

import { assert, assertFalse, assertStrictEquals, assertThrows } from 'std/testing/asserts.ts';
import { describe, it } from 'std/testing/bdd.ts';

import type { FunctionSpec, ParameterSpec, ThrowSpec } from '../spec.ts';

describe('GTIN validator', () => {
	const passingCases: ParameterSpec<typeof isValidGTIN> = [
		['numeric GTIN-14', 95135725845679],
		['string GTIN-14', '95135725845679'],
		['EAN-13', 5099902895529],
		['UPC-12', 731453463127],
		['UPC-12 with leading zero', '093624738626'],
	];

	const failingCases: ThrowSpec<typeof ensureValidGTIN> = [
		['numeric GTIN-14 with invalid check digit', 95135725845671, 'Checksum'],
		['string GTIN-14 with invalid check digit', '95135725845671', 'Checksum'],
		['11 digit number which is a valid GTIN with leading zero', 93624738626, 'invalid length'],
		['empty string', '', 'invalid length'],
		['non-numeric string', 'A0123456789B', 'invalid non-numeric characters'],
	];

	passingCases.forEach(([description, input]) => {
		it(`passes for valid ${description}`, () => {
			assert(isValidGTIN(input));
		});
	});

	failingCases.forEach(([description, input, messageIncludes]) => {
		it(`throws for ${description}`, () => {
			assertThrows(() => ensureValidGTIN(input), TypeError, messageIncludes);
		});
	});
});

describe('check digit calculation', () => {
	const cases: FunctionSpec<typeof checkDigit> = [
		['valid numeric GTIN-14', 95135725845679, 9],
		['valid string GTIN-14', '95135725845679', 9],
		['GTIN-14 with invalid check digit', 95135725845671, 9],
		['GTIN-14 with check digit placeholder', '9513572584567 ', 9],
		['EAN-13', 5099902895529, 9],
		['UPC-12', 731453463127, 7],
		['UPC-12 with leading zero', '093624738626', 6],
		['11 digit number which is a valid GTIN with leading zero', 93624738626, 6],
		['empty string (0)', '', 0],
		['non-numeric string (NaN)', 'A0123456789B', NaN],
	];

	cases.forEach(([description, input, expected]) => {
		it(`works for ${description}`, () => {
			assertStrictEquals(checkDigit(input), expected);
		});
	});
});

describe('GTIN comparison', () => {
	const strictlyEqualCases: ParameterSpec<typeof isEqualGTIN> = [
		['identical numbers', 603051912911, 603051912911],
		['identical numeric strings', '603051912911', '603051912911'],
		['number and its string representation', 603051912911, '603051912911'],
	];

	const equalCases: ParameterSpec<typeof isEqualGTIN> = [
		['numeric string and its zero-padded version', '603051912911', '0603051912911'],
		['number and its zero-padded version', 603051912911, '0603051912911'],
	];

	const notEqualCases: ParameterSpec<typeof isEqualGTIN> = [
		['different numbers', 603051912911, 731453463127],
		['different numeric strings', '603051912911', '731453463127'],
		['number and a different numeric string', 603051912911, '731453463127'],
	];

	strictlyEqualCases.forEach(([description, a, b]) => {
		it(`classifies ${description} as equal`, () => {
			assert(isEqualGTIN(a, b));
		});
		it(`classifies ${description} as strictly equal`, () => {
			assert(isEqualGTIN(a, b, { strict: true }));
		});
	});

	equalCases.forEach(([description, a, b]) => {
		it(`classifies ${description} as equal`, () => {
			assert(isEqualGTIN(a, b));
		});
		it(`classifies ${description} as not strictly equal`, () => {
			assertFalse(isEqualGTIN(a, b, { strict: true }));
		});
	});
	
	notEqualCases.forEach(([description, a, b]) => {
		it(`classifies ${description} as not equal`, () => {
			assertFalse(isEqualGTIN(a, b));
		});
		it(`classifies ${description} as not strictly equal`, () => {
			assertFalse(isEqualGTIN(a, b, { strict: true }));
		});
	});
});
