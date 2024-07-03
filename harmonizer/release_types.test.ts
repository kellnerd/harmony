import {
	capitalizeReleaseType,
	guessLiveRelease,
	guessTypesForRelease,
	guessTypesFromTitle,
	mergeTypes,
	sortTypes,
} from './release_types.ts';
import { HarmonyRelease, HarmonyTrack, ReleaseGroupType } from './types.ts';

import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from 'std/testing/bdd.ts';

import type { FunctionSpec } from '../utils/test_spec.ts';

describe('release types', () => {
	describe('guess types for release', () => {
		const passingCases: Array<[string, HarmonyRelease, string[]]> = [
			['should detect EP type from title', makeRelease('Wake of a Nation (EP)'), ['EP']],
			['should keep existing types', makeRelease('Wake of a Nation (EP)', ['Interview']), ['EP', 'Interview']],
			['should detect live type from title', makeRelease('One Second (Live)'), ['Live']],
			[
				'should detect live type from tracks',
				makeRelease('One Second', undefined, [{ title: 'One Second - Live' }, { title: 'Darker Thoughts - Live' }]),
				['Live'],
			],
		];

		passingCases.forEach(([description, release, expected]) => {
			it(description, () => {
				guessTypesForRelease(release);
				assertEquals(release.types, expected);
			});
		});
	});

	describe('guess types from title', () => {
		const passingCases: FunctionSpec<typeof guessTypesFromTitle> = [
			['should detect Bandcamp style EP', 'Escape from Ultra City (EP)', new Set(['EP'])],
			['should detect live', 'At Folsom Prison (Live)', new Set(['Live'])],
			['should detect iTunes style single', 'True Belief - Single', new Set(['Single'])],
			['should detect type before comment', 'Enter Suicidal Angels - EP (Remastered 2021)', new Set(['EP'])],
			['should detect EP suffix', 'Zero Distance EP', new Set(['EP'])],
			['should detect demo type', 'Parasite Inc. (Demo)', new Set(['Demo'])],
		];

		describe('exact case match', () => {
			passingCases.forEach(([description, input, expected]) => {
				it(description, () => {
					assertEquals(guessTypesFromTitle(input), expected);
				});
			});
		});

		describe('case in-sensitive', () => {
			passingCases.forEach(([description, input, expected]) => {
				it(description, () => {
					assertEquals(guessTypesFromTitle(input.toLowerCase()), expected);
				});
			});
		});
	});

	describe('guess live release', () => {
		const passingCases: FunctionSpec<typeof guessLiveRelease> = [
			['should be true if all tracks have live type', [
				{ title: 'Folson Prison Blues (Live)' },
				{ title: 'Dark As The Dungeon (Live)' },
				{ title: 'I Still Miss Someone (Live)' },
			], true],
			['should support " - Live" style', [
				{ title: 'One Second - Live' },
				{ title: 'Darker Thoughts - Live' },
			], true],
			['should be false if not all tracks are live', [
				{ title: 'Folson Prison Blues (Live)' },
				{ title: 'Dark As The Dungeon' },
				{ title: 'I Still Miss Someone (Live)' },
			], false],
			['should be false for empty list', [], false],
		];

		passingCases.forEach(([description, input, expected]) => {
			it(description, () => {
				assertEquals(guessLiveRelease(input), expected);
			});
		});
	});

	describe('capitalize release type', () => {
		const passingCases: FunctionSpec<typeof capitalizeReleaseType> = [
			['should uppercase first letter', 'single', 'Single'],
			['should handle capitalized input', 'ALBUM', 'Album'],
			['should leave EP uppercase', 'ep', 'EP'],
		];

		passingCases.forEach(([description, input, expected]) => {
			it(description, () => {
				assertEquals(capitalizeReleaseType(input), expected);
			});
		});
	});

	describe('sort types', () => {
		it('should sort primary type first', () => {
			const types: ReleaseGroupType[] = ['Remix', 'Live', 'EP', 'Compilation'];
			const sortedTypes = sortTypes(types);
			assertEquals(sortedTypes, ['EP', 'Compilation', 'Live', 'Remix']);
		});
	});

	describe('merge types', () => {
		it('should reduce to a sorted list with a single primary type', () => {
			const mergedTypes = mergeTypes(
				['Live', 'Album'],
				['Single', 'Compilation', 'Live'],
				['EP'],
			);
			assertEquals(mergedTypes, ['EP', 'Compilation', 'Live']);
		});
	});
});

function makeRelease(
	title: string,
	types: ReleaseGroupType[] | undefined = undefined,
	tracks: HarmonyTrack[] = [],
): HarmonyRelease {
	return {
		title,
		artists: [],
		externalLinks: [],
		media: [{
			tracklist: tracks,
		}],
		types: types,
		info: {
			providers: [],
			messages: [],
		},
	};
}
