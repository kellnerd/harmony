import { describe, it } from '@std/testing/bdd';
import { HarmonyTrack } from '@/harmonizer/types.ts';
import { assertSnapshot } from '@std/testing/snapshot';
import { formatTracklist } from '@/musicbrainz/tracklist.ts';

describe('formatTracklist', () => {
	const dummyTracks: HarmonyTrack[] = [{
		title: 'Track only has a title',
	}, {
		title: 'Track with rounded length',
		length: 123654,
	}, {
		title: 'Track with a single artist',
		artists: [{
			name: 'Artist',
		}],
		number: 4,
		length: 231456,
	}, {
		title: 'Track with multiple artists',
		artists: [{
			name: 'Artist 1',
		}, {
			name: 'Artist 2',
		}, {
			name: 'Artist 3',
		}],
		number: 'B7',
		length: 42000,
	}, {
		title: 'Track with artist credit names and join phrase',
		artists: [{
			name: 'Artist 1',
			creditedName: 'Credit 1',
			joinPhrase: ' feat. ',
		}, {
			name: 'Artist 2',
		}, {
			name: 'Artist 3',
			creditedName: 'Credit 3',
		}],
		number: '123',
		length: 654321,
	}];

	it('formats tracks with default options', async (ctx) => {
		await assertSnapshot(ctx, formatTracklist(dummyTracks));
	});
});
