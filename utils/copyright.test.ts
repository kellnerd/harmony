import { formatCopyrightSymbols } from './copyright.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';

import type { FunctionSpec } from './test_spec.ts';

describe('format copyright symbols', () => {
	const passingCases: FunctionSpec<typeof formatCopyrightSymbols> = [
		['should keep string without symbols', 'Nuclear Blast', undefined, 'Nuclear Blast'],
		['should replace (P)', '(P) 2016 Century Media Records Ltd.', undefined, '℗ 2016 Century Media Records Ltd.'],
		['should keep symbols', '© 2012 S. Carter Enterprises, LLC.', undefined, '© 2012 S. Carter Enterprises, LLC.'],
		[
			'should convert multiple symbols',
			'(p)(c) 2017 S. CARTER ENTERPRISES, LLC. MARKETED BY ROC NATION & DISTRIBUTED BY ROC NATION/UMG RECORDINGS INC.',
			undefined,
			'℗© 2017 S. CARTER ENTERPRISES, LLC. MARKETED BY ROC NATION & DISTRIBUTED BY ROC NATION/UMG RECORDINGS INC.',
		],
		['should prepend expected symbol', 'Nuclear Blast', '℗', '℗ Nuclear Blast'],
		['should not prepend symbol if it exists', '2024 ℗ Nuclear Blast', '℗', '2024 ℗ Nuclear Blast'],
		['should not prepend symbol if any exists', '2024 © Nuclear Blast', '℗', '2024 © Nuclear Blast'],
		['should not prepend symbol if it exists as text', '(c)+(p) Nuclear Blast', '℗', '©+℗ Nuclear Blast'],
	];

	passingCases.forEach(([description, copyright, expectedSymbol, expected]) => {
		it(description, () => {
			assertEquals(formatCopyrightSymbols(copyright, expectedSymbol), expected);
		});
	});
});
