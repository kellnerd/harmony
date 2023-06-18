import { checkDigit, isValidGTIN } from '../../src/utils/gtin.ts'

import { assert, assertFalse, assertStrictEquals } from 'std/testing/asserts.ts';
import { describe, it } from 'std/testing/bdd.ts';

describe('GTIN validator', () => {
	it('passes for valid numeric GTIN-14', () => {
		assert(isValidGTIN(95135725845679));
	});
	it('passes for valid string GTIN-14', () => {
		assert(isValidGTIN('95135725845679'));
	});
	it('fails for invalid check digit', () => {
		assertFalse(isValidGTIN(95135725845671));
	});
	it('passes for valid EAN-13', () => {
		assert(isValidGTIN(5099902895529));
	});
	it('passes for valid UPC-12', () => {
		assert(isValidGTIN(731453463127));
	});
	it('passes for valid UPC-12 with leading zero', () => {
		assert(isValidGTIN('093624738626'));
	});
	it('fails for 11 digit number which is a valid GTIN with leading zero', () => {
		assertFalse(isValidGTIN(93624738626));
	});
});

describe('check digit calculation', () => {
	it('handles valid numeric GTIN', () => {
		assertStrictEquals(checkDigit(95135725845679), 9);
	});
	it('handles numeric GTIN with invalid check digit', () => {
		assertStrictEquals(checkDigit(95135725845671), 9);
	});
	it('handles valid string GTIN', () => {
		assertStrictEquals(checkDigit('95135725845679'), 9);
	});
	it('handles string GTIN with check digit placeholder', () => {
		assertStrictEquals(checkDigit('9513572584567 '), 9);
	});
});
