import { parseISODuration } from './time.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from 'std/testing/bdd.ts';

import type { FunctionSpec } from './test_spec.ts';

describe('parse ISO duration', () => {
	const passingCases: FunctionSpec<typeof parseISODuration> = [
		['hours, minutes, seconds', 'PT2H41M5S', 9665000],
		['minutes, seconds', 'PT41M5S', 2465000],
		['minutes', 'PT3M', 180000],
		['empty as zero', '', 0],
		['invalid as zero', 'P', 0],
	];

	passingCases.forEach(([description, input, expected]) => {
		it(`parses ${description}`, () => {
			assertEquals(parseISODuration(input), expected);
		});
	});
});
