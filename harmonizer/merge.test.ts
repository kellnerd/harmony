import { mergeResolvableEntityArray, mergeSortedResolvableEntityArray } from './merge.ts';
import type { ResolvableEntity } from '@/harmonizer/types.ts';

import { describe, it } from '@std/testing/bdd';
import { assertEquals } from 'std/assert/assert_equals.ts';

function fakeEntity(name: string, ...providers: string[]): ResolvableEntity {
	return {
		name,
		externalIds: providers.map((provider) => ({ provider, type: 'entity', id: provider })),
	};
}

type EntityParams = Parameters<typeof fakeEntity>;

const sortedEntityArrayCases: Array<[string, EntityParams[], EntityParams[][], EntityParams[]]> = [
	['one entity (same name)', [['Test', 'A']], [
		[['Test', 'B']],
		[['Test', 'C']],
	], [['Test', 'A', 'B', 'C']]],
	['two entities (same names, same order)', [['Jane', 'A1'], ['John', 'A2']], [
		[['Jane', 'B1'], ['John', 'B2']],
	], [['Jane', 'A1', 'B1'], ['John', 'A2', 'B2']]],
	['multiple entities (similar names, same order)', [['Jané', 'A1'], ['John', 'A2'], ['T.E.S.T.', 'A3']], [
		[['Jane', 'B1'], ['Jöhn', 'B2'], ['TEST']],
		[['Ja-ne', 'C1'], ['"John"'], ['test', 'C3']],
	], [['Jané', 'A1', 'B1', 'C1'], ['John', 'A2', 'B2'], ['T.E.S.T.', 'A3', 'C3']]],
	['one entity (same name) with duplicate identifiers', [['Test', 'A']], [
		[['Test', 'A']],
		[['Test', 'B', 'B']],
	], [['Test', 'A', 'B']]],
];

const unorderedEntityArrayCases: Array<[string, EntityParams[], EntityParams[][], EntityParams[]]> = [
	['two entities (same names, swapped order)', [['Jane', 'A1'], ['John', 'A2']], [
		[['John', 'B2'], ['Jane', 'B1']],
	], [['Jane', 'A1', 'B1'], ['John', 'A2', 'B2']]],
];

describe('mergeSortedResolvableEntityArray', () => {
	sortedEntityArrayCases.forEach(([description, target, sources, expected]) => {
		it(`merges identifiers of ${description}`, () => {
			const targetEntityArray = target.map((params) => fakeEntity(...params));
			const expectedTargetEntityArray = expected.map((params) => fakeEntity(...params));
			const sourceEntityArrays = sources.map((paramsArray) => paramsArray.map((params) => fakeEntity(...params)));

			mergeSortedResolvableEntityArray(targetEntityArray, sourceEntityArrays);
			assertEquals(targetEntityArray, expectedTargetEntityArray);
		});
	});

	// Proves that deduplication by reference works (which is sufficient for now).
	it('merges identifiers without duplicates when the target entity is among the sources', () => {
		const targetEntityArray = [fakeEntity('Test', 'A')];
		const sourceEntityArrays = [targetEntityArray, [fakeEntity('Test', 'B')]];
		const expectedTargetEntityArray = [fakeEntity('Test', 'A', 'B')];

		mergeSortedResolvableEntityArray(targetEntityArray, sourceEntityArrays);
		assertEquals(targetEntityArray, expectedTargetEntityArray);
	});

	unorderedEntityArrayCases.forEach(([description, target, sources]) => {
		it(`fails to merge identifiers of ${description}`, () => {
			const targetEntityArray = target.map((params) => fakeEntity(...params));
			const expectedTargetEntityArray = target.map((params) => fakeEntity(...params));
			const sourceEntityArrays = sources.map((paramsArray) => paramsArray.map((params) => fakeEntity(...params)));

			mergeSortedResolvableEntityArray(targetEntityArray, sourceEntityArrays);
			assertEquals(targetEntityArray, expectedTargetEntityArray);
		});
	});
});

describe('mergeResolvableEntityArray', () => {
	sortedEntityArrayCases.concat(unorderedEntityArrayCases).forEach(([description, target, sources, expected]) => {
		it(`merges identifiers of ${description}`, () => {
			const targetEntityArray = target.map((params) => fakeEntity(...params));
			const expectedTargetEntityArray = expected.map((params) => fakeEntity(...params));
			const sourceEntityArrays = sources.map((paramsArray) => paramsArray.map((params) => fakeEntity(...params)));

			mergeResolvableEntityArray(targetEntityArray, sourceEntityArrays);
			assertEquals(targetEntityArray, expectedTargetEntityArray);
		});
	});

	it('merges identifiers without duplicates when the target entity is among the sources', () => {
		const targetEntityArray = [fakeEntity('Test', 'A')];
		const sourceEntityArrays = [targetEntityArray, [fakeEntity('Test', 'B')]];
		const expectedTargetEntityArray = [fakeEntity('Test', 'A', 'B')];

		mergeResolvableEntityArray(targetEntityArray, sourceEntityArrays);
		assertEquals(targetEntityArray, expectedTargetEntityArray);
	});
});
