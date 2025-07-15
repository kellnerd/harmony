import { assertEquals } from 'std/assert/assert_equals.ts';
import { assertThrows } from 'std/assert/assert_throws.ts';
import { describe, it } from '@std/testing/bdd';
import { extractMBID } from './extract_mbid.ts';

describe('extractMBID', () => {
	it('accepts a v4 UUID', () => {
		const v4uuid = 'e5a77768-ff64-46f2-a13e-9d368b413cff';
		assertEquals(extractMBID(v4uuid), v4uuid);
	});

	it('accepts a v3 UUID', () => {
		const v3uuid = '9706e7fa-4ed1-3b40-b638-45a21ff634f5';
		assertEquals(extractMBID(v3uuid), v3uuid);
	});

	it('accepts a MusicBrainz entity link', () => {
		assertEquals(
			extractMBID('https://musicbrainz.org/recording/e5a77768-ff64-46f2-a13e-9d368b413cff'),
			'e5a77768-ff64-46f2-a13e-9d368b413cff',
		);
	});

	it('accepts only MusicBrainz entity links with the expected type', () => {
		assertEquals(
			extractMBID('https://beta.musicbrainz.org/release/da14004d-f6af-4dd7-aab7-033bef53e805', ['release']),
			'da14004d-f6af-4dd7-aab7-033bef53e805',
		);
		assertThrows(
			() => extractMBID('https://musicbrainz.org/recording/e5a77768-ff64-46f2-a13e-9d368b413cff', ['release']),
		);
	});

	it('rejects any other text', () => {
		assertThrows(() => extractMBID('test'));
	});
});
