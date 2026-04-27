import { ProviderError } from '@/utils/errors.ts';
import { longestCommonPrefix } from '@std/text/unstable-longest-common-prefix';
import type { Track } from './api_types.ts';

export interface TracklistSection {
	/** Tracks which belong to this section. */
	tracks: Track[];
	/** Heading of the section, may be a medium title. */
	heading?: string;
	/** Common prefix of the track positions. */
	positionPrefix?: RegExp;
	/** Indicates whether the track position has a medium prefix. */
	hasMediumPrefix?: boolean;
	type?: 'track group' | 'side' | 'medium';
}

export interface Medium {
	/** Tracklist sections on the medium. */
	sections: TracklistSection[];
	/** Title of the medium, inherited from the section heading. */
	title?: string;
}

/**
 * Splits the given flat tracklist into sections by headings and by position prefixes.
 *
 * @param tracks Flat tracklist which may include headings.
 */
export function splitTracklistIntoSections(tracks: Track[]): TracklistSection[] {
	const sections: TracklistSection[] = [];
	let currentSection: TracklistSection = {
		tracks: [],
	};

	for (const track of tracks) {
		switch (track.type_) {
			case 'heading':
				if (currentSection.tracks.length) {
					// Start a new section unless the current section is empty.
					sections.push(currentSection);
					currentSection = {
						tracks: [],
						type: 'track group',
						// Continue with the previous prefix.
						hasMediumPrefix: currentSection.hasMediumPrefix,
						positionPrefix: currentSection.positionPrefix,
					};
				}
				// TODO: handle multiple consecutive headings
				currentSection.heading = track.title;
				break;
			case 'index':
				// Inherit index track position from its sub-tracks (common prefix without trailing punctuation).
				if (!track.position && track.sub_tracks) {
					track.position = longestCommonPrefix(track.sub_tracks.map((track) => track.position)).replace(/\.$/, '');
				}
				// fall through to regular track position handling
			case 'track':
				if (currentSection.positionPrefix) {
					if (!currentSection.positionPrefix.test(track.position)) {
						// Start a new section when the position prefix changes, unless the current section is empty.
						if (currentSection.tracks.length) {
							sections.push(currentSection);
							currentSection = {
								tracks: [],
								// Continue with the previous heading.
								heading: currentSection.heading,
							};
						}
						updateCurrentPositionPrefix(track.position);
					}
				} else {
					updateCurrentPositionPrefix(track.position);
				}
				currentSection.tracks.push(track);
				break;
			default:
				throw new ProviderError('Discogs', `Unsupported track type '${track.type_}'`);
		}
	}
	if (currentSection.tracks.length) {
		// Store last section unless it es empty.
		sections.push(currentSection);
	}

	return sections;

	function updateCurrentPositionPrefix(trackPosition: string) {
		const sidePrefix = trackPosition.match(/^[A-Z]+(?=\d|$)/)?.[0];
		if (sidePrefix) {
			currentSection.type = 'side';
			currentSection.positionPrefix = new RegExp(String.raw`^${sidePrefix}(?=\d|$)`);
			return;
		}

		const mediumPrefix = trackPosition.match(/^\d+-(?=\d)/)?.[0];
		if (mediumPrefix) {
			currentSection.type = 'medium';
			currentSection.hasMediumPrefix = true;
			currentSection.positionPrefix = new RegExp(String.raw`^${mediumPrefix}(?=\d)`);
			return;
		}
	}
}

export function combineTracklistSectionsToMedia(sections: TracklistSection[]): Medium[] {
	const media: Medium[] = [];
	let currentMedium: Medium = {
		sections: [],
	};

	for (const section of sections) {
		switch (section.type) {
			case 'medium':
				if (currentMedium.sections.length) {
					// Store previous medium unless it is empty.
					media.push(currentMedium);
				}
				currentMedium = {
					sections: [section],
					title: section.heading,
				};
				break;
			case 'side':
				if (currentMedium.sections.filter((section) => section.type === 'side').length === 2) {
					// Store previous medium if it already has two sides.
					media.push(currentMedium);
					currentMedium = { sections: [] };
				}
				if (!currentMedium.sections.length) {
					// Set medium title using the first side's title.
					currentMedium.title = section.heading;
				}
				currentMedium.sections.push(section);
				break;
			default:
				currentMedium.sections.push(section);
		}
	}
	if (currentMedium.sections.length) {
		// Store last medium unless it es empty.
		media.push(currentMedium);
	}

	return media;
}
