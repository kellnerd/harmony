import { checkDigit, ensureValidGTIN, formatGtin, isEqualGTIN, isValidGTIN } from './gtin.ts';

import { assert } from 'std/assert/assert.ts';
import { assertFalse } from 'std/assert/assert_false.ts';
import { assertStrictEquals } from 'std/assert/assert_strict_equals.ts';
import { assertThrows } from 'std/assert/assert_throws.ts';
import { describe, it } from 'std/testing/bdd.ts';

import type { FunctionSpec, ParameterSpec, ThrowSpec } from './test_spec.ts';

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
		['empty string', '', 'empty'],
		['non-numeric string', 'A0123456789B', 'invalid non-numeric characters'],
		['random text', 'certainly not a GTIN', 'invalid non-numeric characters'],
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

describe('GTIN formatter', () => {
	const cases: FunctionSpec<typeof formatGtin> = [
		['pads numeric UPC-12', 731453463127, 14, '00731453463127'],
		['pads string UPC-12', '731453463127', 14, '00731453463127'],
		['does not pad GTIN-14', '95135725845679', 14, '95135725845679'],
		['truncates UPC-12 with leading zeros', '00603051912911', 0, '603051912911'],
		['does not truncate GTIN-14', '95135725845679', 0, '95135725845679'],
	];

	cases.forEach(([description, input, length, expected]) => {
		it(description, () => {
			assertStrictEquals(formatGtin(input, length), expected);
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
