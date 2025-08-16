import { formatDuration, parseISODuration } from './time.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from 'std/testing/bdd.ts';

import type { FunctionSpec } from './test_spec.ts';

describe('formatDuration', () => {
	const testCases: FunctionSpec<typeof formatDuration> = [
		['shows milliseconds if available', 1234567, undefined, '20:34.567'],
		['shows hours if available', 3654321, undefined, '1:00:54.321'],
		['always shows minutes', 12345, undefined, '0:12.345'],
		['hides empty milliseconds by default', 1234000, undefined, '20:34'],
		['shows empty milliseconds if explicitly configured', 1234000, { showMs: true }, '20:34.000'],
		['rounds to seconds if milliseconds are hidden', 1234567, { showMs: false }, '20:35'],
	];

	testCases.forEach(([description, ms, options, expected]) => {
		it(description, () => {
			assertEquals(formatDuration(ms, options), expected);
		});
	});
});

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
