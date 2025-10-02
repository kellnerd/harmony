import {
	capitalizeReleaseType,
	guessDjMixRelease,
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
		const passingCases: Array<[string, HarmonyRelease, ReleaseGroupType[]]> = [
			['should detect EP type from title', makeRelease('Wake of a Nation (EP)'), ['EP']],
			['should keep existing types', makeRelease('Wake of a Nation (EP)', ['Interview']), ['EP', 'Interview']],
			['should detect live type from title', makeRelease('One Second (Live)'), ['Live']],
			[
				'should detect live type from tracks',
				makeRelease('One Second', undefined, [{ title: 'One Second - Live' }, { title: 'Darker Thoughts - Live' }]),
				['Live'],
			],
			['should detect DJ-mix type from title', makeRelease('DJ-Kicks (Forest Swords) [DJ Mix]'), ['DJ-mix']],
			[
				'should detect DJ-mix type from tracks',
				makeRelease('DJ-Kicks: Modeselektor', undefined, [
					{ title: 'PREY - Mixed' },
					{ title: 'Permit Riddim - Mixed' },
				]),
				['DJ-mix'],
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
			// Remix releases
			...([
				'Human (Paul Woolford Remix)',
				'Paper Romance (Purple Disco Machine Remix - Edit)',
				'Paper Romance (Purple Disco Machine Remix) [Edit]',
				'Paper Romance (Purple Disco Machine Remix) (Edit)',
				'Paper Romance (Purple Disco Machine Remix; Edit)',
				"Stay (Don't Go Away) [feat. Raye] [Nicky Romero Remix]",
				'Anti‐Hero (Kungs remix extended version)',
				'Remix',
				'Anti‐Hero (Remixes)',
				'The One (feat. Daddy Yankee) [The Remixes]',
				'The Remixes',
				'The Remixes - Vol.1',
				'The Remixes, Pt. 1',
				'Remixes',
				'Remixes 81>04',
				'Never Say Never - The Remixes',
				'Skin: The Remixes',
				'The Hills Remixes',
				'MIDI Kittyy - The Remixes Vol 1',
				'The Slow Rush B-Sides & Remixes',
				'Remixed',
				'Remixed (2003 Remaster)',
				'Remixed Sides',
				'Remixed: The Definitive Collection',
				'The Hits: Remixed',
				'Remixed & Revisited',
				'Revived Remixed Revisited',
				'Welcome To My World (Remixed)',
				'Mörkrets Narr Remixed',
			].map((
				title,
			): FunctionSpec<typeof guessTypesFromTitle>[number] => [
				`should detect remix type (${title})`,
				title,
				new Set(['Remix']),
			])),
			['should not treat a premix as remix', 'Wild (premix version)', new Set()],
			// DJ Mix releases
			...([
				'Kitsuné Musique Mixed by YOU LOVE HER (DJ Mix)',
				'Club Life - Volume One Las Vegas (Continuous DJ Mix)',
				'DJ-Kicks (Forest Swords) [DJ Mix]',
				'Paragon Continuous DJ Mix',
				'Babylicious (Continuous DJ Mix by Baby Anne)',
			].map((
				title,
			): FunctionSpec<typeof guessTypesFromTitle>[number] => [
				`should detect DJ-mix type (${title})`,
				title,
				new Set(['DJ-mix']),
			])),
			['should not treat just DJ mix as DJ-mix', 'DJ mix', new Set()],
			// Multiple types
			[
				'should detect both remix and soundtrack type',
				'The Sims 2: Nightlife (Remixes) (Original Soundtrack)',
				new Set(['Remix', 'Soundtrack']),
			],
			[
				'should detect both remix and soundtrack type',
				'Remixes - EP',
				new Set(['EP', 'Remix']),
			],
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

	describe('guess DJ-mix release', () => {
		const passingCases: FunctionSpec<typeof guessDjMixRelease> = [
			['should be true if all tracks have mixed type', [
				{
					tracklist: [
						{ title: 'Heavenly Hell (feat. Ne-Yo) (Mixed)' },
						{ title: 'Clap Back (feat. Raphaella) (Mixed)' },
						{ title: '2x2 (Mixed)' },
					],
				},
			], true],
			['should be true if all tracks on one medium have mixed type', [
				{
					tracklist: [
						{ title: 'PREY - Mixed' },
						{ title: 'Permit Riddim - Mixed' },
						{ title: 'MEGA MEGA MEGA (DJ-Kicks) - Mixed' },
					],
				},
				{
					tracklist: [
						{ title: 'PREY' },
						{ title: 'Permit Riddim' },
						{ title: 'MEGA MEGA MEGA (DJ-Kicks)' },
					],
				},
			], true],
			['should support " - Mixed" style', [
				{
					tracklist: [
						{ title: 'Salute - Mixed' },
						{ title: 'Friday - Mixed' },
					],
				},
			], true],
			['should support case insensitive of mixed', [
				{
					tracklist: [
						{ title: 'Heavenly Hell (feat. Ne-Yo) (mixed)' },
						{ title: 'Clap Back (feat. Raphaella) (mixed)' },
						{ title: '2x2 (mixed)' },
					],
				},
			], true],
			['should support mixed usage of formats', [
				{
					tracklist: [
						{ title: 'Heavenly Hell (feat. Ne-Yo) [Mixed]' },
						{ title: 'Clap Back (feat. Raphaella) (Mixed)' },
						{ title: '2x2 - Mixed' },
					],
				},
			], true],
			['should be false if not all tracks are mixed', [
				{
					tracklist: [
						{ title: 'Heavenly Hell (feat. Ne-Yo) (Mixed)' },
						{ title: 'Clap Back (feat. Raphaella)' },
						{ title: '2x2 (Mixed)' },
					],
				},
			], false],
			['should be false for empty tracklist', [{
				tracklist: [],
			}], false],
			['should be false for no medium', [], false],
		];

		passingCases.forEach(([description, input, expected]) => {
			it(description, () => {
				assertEquals(guessDjMixRelease(input), expected);
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
