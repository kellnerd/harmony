import { splitLabels } from './label.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';

import type { FunctionSpec } from './test_spec.ts';

describe('split labels', () => {
	const passingCases: FunctionSpec<typeof splitLabels> = [
		['preserves single label', 'Nuclear Blast', [{ name: 'Nuclear Blast' }]],
		['splits multiple labels', 'Roc Nation/RocAFella/IDJ', [{ name: 'Roc Nation' }, { name: 'RocAFella' }, {
			name: 'IDJ',
		}]],
		['splits multiple labels and trims values', 'Roc Nation / RocAFella / IDJ', [{ name: 'Roc Nation' }, {
			name: 'RocAFella',
		}, {
			name: 'IDJ',
		}]],
		['preserves label whose suffix contains a slash', 'EMI Belgium SA/NV', [{ name: 'EMI Belgium SA/NV' }]],
	];

	passingCases.forEach(([description, input, expected]) => {
		it(description, () => {
			assertEquals(splitLabels(input), expected);
		});
	});
});
