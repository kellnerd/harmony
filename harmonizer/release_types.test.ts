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
import { describe, it } from '@std/testing/bdd';

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
				const guessedTypes = guessTypesForRelease(release);
				assertEquals(new Set(guessedTypes), new Set(expected));
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
			// Soundtrack releases
			...([
				// Titles with original/official <medium> soundtrack
				'The Lord of the Rings: The Return of the King (Original Motion Picture Soundtrack)',
				'The Bodyguard - Original Soundtrack Album',
				'Plants Vs. Zombies (Original Video Game Soundtrack)',
				'Stardew Valley (Original Game Soundtrack)',
				'L.A. Noire Official Soundtrack',
				'Tarzan (Deutscher Original Film-Soundtrack)',
				'Die Eiskönigin Völlig Unverfroren (Deutscher Original Film Soundtrack)',
				// Soundtrack from the ... <medium>
				'KPop Demon Hunters (Soundtrack from the Netflix Film)',
				'The Witcher: Season 2 (Soundtrack from the Netflix Original Series)',
				'The White Lotus (Soundtrack from the HBO® Original Limited Series)',
				'Inception (Music from the Motion Picture)',
				// Releases referring to score instead of soundtrack
				'Fantastic Mr. Fox - Additional Music From The Original Score By Alexandre Desplat - The Abbey Road Mixes',
				'Scott Pilgrim Vs. The World (Original Score Composed by Nigel Godrich)',
				'F1® The Movie (Original Score By Hans Zimmer)',
				'EUPHORIA SEASON 2 OFFICIAL SCORE (FROM THE HBO ORIGINAL SERIES)',
				'The Bible (Official Score Soundtrack)',
				'The Good Wife (The Official TV Score)',
				// German release titles
				'Get Up (Der Original Soundtrack zum Kinofilm)',
				'Ein Mädchen namens Willow - Soundtrack zum Film',
				'Das Boot (Soundtrack zur TV Serie, zweite Staffel)',
				// Swedish release titles
				'Fucking Åmål - Musiken från filmen',
				'Fejkpatient (Musik från TV-serien)',
				'Kärlek Fårever (Soundtrack till Netflix-filmen)',
				// Norwegian release titles
				'Kvitebjørn (Musikken fra filmen)',
				'Døden på Oslo S (Musikken fra teaterforestillingen)',
				// Musical releases
				'The Lion King: Original Broadway Cast Recording',
			].map((
				title,
			): FunctionSpec<typeof guessTypesFromTitle>[number] => [
				`should detect soundtrack type (${title})`,
				title,
				new Set(['Soundtrack']),
			])),
		];

		const passingCaseSensitiveCases: FunctionSpec<typeof guessTypesFromTitle> = [
			// Soundtrack releases
			...([
				// Releases with OST abbreviation
				'O.S.T. Das Boot',
				'Alvin & The Chipmunks / OST',
			].map((
				title,
			): FunctionSpec<typeof guessTypesFromTitle>[number] => [
				`should detect soundtrack type (${title})`,
				title,
				new Set(['Soundtrack']),
			])),
		];

		describe('exact case match', () => {
			[...passingCases, ...passingCaseSensitiveCases].forEach(([description, input, expected]) => {
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
			['should be false for empty tracklist', [], false],
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
			['should keep casing of Mixtape/Street', 'Mixtape/street', 'Mixtape/Street'],
			['should keep casing of DJ-mix', 'DJ-Mix', 'DJ-mix'],
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
