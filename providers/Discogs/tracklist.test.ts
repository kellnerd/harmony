import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';
import type { Track } from './api_types.ts';
import { splitTracklistIntoSections, type TracklistSection } from './tracklist.ts';

describe('splitTracklistIntoSections', () => {
	it('handles simple numeric tracklist', () => {
		assertTracklistSections(
			fakeTracksWithPositions('1', '2', '3'),
			[{ type: 'medium', trackPositions: ['1', '2', '3'] }],
		);
	});

	it('splits tracklist with medium number prefixes', () => {
		assertTracklistSections(
			fakeTracksWithPositions('1-1', '1-2', '1-3', '2-1', '2-2'),
			[
				{ type: 'medium', trackPositions: ['1-1', '1-2', '1-3'], hasMediumPrefix: true },
				{ type: 'medium', trackPositions: ['2-1', '2-2'], hasMediumPrefix: true },
			],
		);
	});

	it('splits tracklist with medium format and number prefixes', () => {
		assertTracklistSections(
			fakeTracksWithPositions('CD1-1', 'CD1-2', 'CD1-3', 'DVD2-1', 'DVD2-2'),
			[
				{ type: 'medium', trackPositions: ['CD1-1', 'CD1-2', 'CD1-3'], hasMediumPrefix: true },
				{ type: 'medium', trackPositions: ['DVD2-1', 'DVD2-2'], hasMediumPrefix: true },
			],
		);
	});

	it('detects track positions with side prefix', () => {
		assertTracklistSections(
			fakeTracksWithPositions('A1', 'A2', 'A3', 'B1', 'B2'),
			[
				{ type: 'side', trackPositions: ['A1', 'A2', 'A3'] },
				{ type: 'side', trackPositions: ['B1', 'B2'] },
			],
		);
	});

	it('handles side numbers', () => {
		assertTracklistSections(
			fakeTracksWithPositions('A', 'B', 'C', 'D'),
			[
				{ type: 'side', trackPositions: ['A'] },
				{ type: 'side', trackPositions: ['B'] },
				{ type: 'side', trackPositions: ['C'] },
				{ type: 'side', trackPositions: ['D'] },
			],
		);
	});

	it('handles mixed tracklist with numbered mediums and side prefixes', () => {
		assertTracklistSections(
			fakeTracksWithPositions('1-1', '1-2', '2-1', '2-2', '2-3', 'A1', 'A2', 'B'),
			[
				{ type: 'medium', trackPositions: ['1-1', '1-2'], hasMediumPrefix: true },
				{ type: 'medium', trackPositions: ['2-1', '2-2', '2-3'], hasMediumPrefix: true },
				{ type: 'side', trackPositions: ['A1', 'A2'] },
				{ type: 'side', trackPositions: ['B'] },
			],
		);
	});

	it('detects sides after numeric positions without medium prefix', () => {
		assertTracklistSections(
			fakeTracksWithPositions('1', '2', 'A1', 'A2', 'B'),
			[
				{ type: 'medium', trackPositions: ['1', '2'] },
				{ type: 'side', trackPositions: ['A1', 'A2'] },
				{ type: 'side', trackPositions: ['B'] },
			],
		);
	});

	it('detects numeric positions without medium prefix after sides as new medium', () => {
		assertTracklistSections(
			fakeTracksWithPositions('A', 'B', '1', '2'),
			[
				{ type: 'side', trackPositions: ['A'] },
				{ type: 'side', trackPositions: ['B'] },
				{ type: 'medium', trackPositions: ['1', '2'] },
			],
		);
	});

	it('determines position of index track from its sub-tracks', () => {
		assertTracklistSections(
			[fakeIndexTrackWithPositions('1.1', '1.2'), ...fakeTracksWithPositions('2', '3')],
			[{ type: 'medium', trackPositions: ['1', '2', '3'] }],
			'Numeric sub-track suffixes with leading dot should be detected',
		);
		assertTracklistSections(
			[...fakeTracksWithPositions('1', '2'), fakeIndexTrackWithPositions('3a', '3b', '3c')],
			[{ type: 'medium', trackPositions: ['1', '2', '3'] }],
			'Alphabetic sub-track suffixes should be detected',
		);
		assertTracklistSections(
			[...fakeTracksWithPositions('1', '2'), fakeIndexTrackWithPositions('3.a', '3.b')],
			[{ type: 'medium', trackPositions: ['1', '2', '3'] }],
			'Alphabetic sub-track suffixes with leading dot should be detected',
		);
	});

	it('treats abused index track without sub-track position suffixes as track group', () => {
		assertTracklistSections(
			[...fakeTracksWithPositions('1-1', '1-2'), fakeIndexTrackWithPositions('1-3', '1-4')],
			[
				{ type: 'medium', trackPositions: ['1-1', '1-2'], hasMediumPrefix: true },
				{ type: 'track group', heading: 'Index track', trackPositions: ['1-3', '1-4'], hasMediumPrefix: true },
			],
		);
	});
});

type FakeTracklistSection = Omit<TracklistSection, 'tracks' | 'positionPrefix'> & {
	trackPositions: string[];
};

function assertTracklistSections(tracks: Track[], expectedSections: FakeTracklistSection[], message?: string) {
	const actualSections = splitTracklistIntoSections(tracks).map((section) => {
		// Drop `tracks` data (irrelevant) and `positionPrefix` (implementation detail).
		const fakeSection: FakeTracklistSection = {
			trackPositions: section.tracks.map((track) => track.position),
			hasMediumPrefix: section.hasMediumPrefix,
			type: section.type,
		};
		if (section.heading) {
			fakeSection.heading = section.heading;
		}
		if (section.parentHeading) {
			fakeSection.parentHeading = section.parentHeading;
		}
		return fakeSection;
	});
	expectedSections = expectedSections.map((section) => ({
		hasMediumPrefix: false,
		...section,
	}));
	assertEquals(actualSections, expectedSections, message);
}

function fakeTracksWithPositions(...positions: string[]): Track[] {
	return positions.map((position) => ({
		duration: '',
		position: position,
		title: `Track ${position}`,
		type_: 'track',
	}));
}

function fakeIndexTrackWithPositions(...positions: string[]): Track {
	return {
		duration: '',
		position: '',
		title: 'Index track',
		type_: 'index',
		sub_tracks: positions.map((position) => ({
			duration: '',
			position: position,
			title: `Sub-track ${position}`,
			type_: 'track',
		})),
	};
}
