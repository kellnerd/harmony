import { checkDigit, ensureValidGTIN, isValidGTIN } from '../../src/utils/gtin.ts';

import { assert, assertStrictEquals, assertThrows } from 'std/testing/asserts.ts';
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
