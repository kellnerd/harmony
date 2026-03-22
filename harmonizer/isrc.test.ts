import { assertEquals } from 'std/assert/assert_equals.ts';
import { assertThrows } from 'std/assert/assert_throws.ts';
import { describe, it } from 'std/testing/bdd.ts';
import type { FunctionSpec } from '@/utils/test_spec.ts';
import { ISRC, normalizeISRC } from './isrc.ts';

describe('ISRC', () => {
	it('parses a hyphenated ISRC', () => {
		const isrc = new ISRC('GB-AYE-69-00531');
		assertEquals(isrc.country, 'GB');
		assertEquals(isrc.registrant, 'AYE');
		assertEquals(isrc.year, '69');
		assertEquals(isrc.designation, '00531');
		assertEquals(isrc.format(), 'GB-AYE-69-00531');
		assertEquals(isrc.format(' '), 'GB AYE 69 00531');
		assertEquals(isrc.toString(), 'GBAYE6900531');
	});
	it('normalizes a lowercased ISRC', () => {
		const isrc = new ISRC(' ushm81871741 ');
		assertEquals(isrc.country, 'US');
		assertEquals(isrc.registrant, 'HM8');
		assertEquals(isrc.year, '18');
		assertEquals(isrc.designation, '71741');
		assertEquals(isrc.raw, 'ushm81871741');
		assertEquals(isrc.format(), 'US-HM8-18-71741');
		assertEquals(isrc.toString(), 'USHM81871741');
	});
	it('throws for unrecognized input', () => {
		assertThrows(() => new ISRC(''));
	});
});

describe('normalizeISRC', () => {
	const testCases: FunctionSpec<typeof normalizeISRC> = [
		['preserves normalized ISRC', 'GBAYE6900531', 'GBAYE6900531'],
		['supports hyphenated ISRC', 'GB-AYE-69-00531', 'GBAYE6900531'],
		['allows ISRC with alphanumeric owner code', 'US-AT2-23-06147', 'USAT22306147'],
		['supports lowercased ISRC', 'ushm81871741', 'USHM81871741'],
		['ignores unrecognized input', 'invalid text', undefined],
	];
	testCases.forEach(([description, isrc, expected]) => {
		it(description, () => {
			assertEquals(normalizeISRC(isrc), expected);
		});
	});
});
