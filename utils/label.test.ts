import { splitLabels } from './label.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from 'std/testing/bdd.ts';

import type { FunctionSpec } from './test_spec.ts';

describe('GTIN validator', () => {
	const passingCases: FunctionSpec<typeof splitLabels> = [
		['preserves single label', 'Nuclear Blast', [{ name: 'Nuclear Blast' }]],
		['split multiple labels', 'Roc Nation/RocAFella/IDJ', [{ name: 'Roc Nation' }, { name: 'RocAFella' }, {
			name: 'IDJ',
		}]],
		['split multiple labels, trim values', 'Roc Nation / RocAFella / IDJ', [{ name: 'Roc Nation' }, {
			name: 'RocAFella',
		}, {
			name: 'IDJ',
		}]],
		['preserve label whose suffix contains a slash', 'EMI Belgium SA/NV', [{ name: 'EMI Belgium SA/NV' }]],
	];

	passingCases.forEach(([description, input, expected]) => {
		it(description, () => {
			assertEquals(splitLabels(input), expected);
		});
	});
});
