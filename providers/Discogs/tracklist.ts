import { ProviderError } from '@/utils/errors.ts';
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
			case 'heading': {
				nextSection();
				// TODO: handle multiple consecutive headings
				const heading = cleanHeading(track.title);
				if (heading === '-') {
					// Treat "empty" headings as section reset.
					currentSection.heading = undefined;
				} else {
					currentSection.heading = heading;
				}
				break;
			}
			case 'index':
				// Inherit index track position from its sub-tracks (common prefix without trailing punctuation).
				if (!track.position && track.sub_tracks) {
					const indexPositionPrefix = commonIndexPositionPrefix(track.sub_tracks.map((track) => track.position));
					if (indexPositionPrefix) {
						track.position = indexPositionPrefix;
					} else {
						// No index track suffixes detected.
						// => This is an abuse of sub-tracks, these should be tracks inside their own section!
						const previousHeading = currentSection.heading;
						nextSection();
						// Treat index track title as heading.
						currentSection.heading = cleanHeading(track.title);
						for (const subTrack of track.sub_tracks) {
							pushTrack(subTrack);
						}
						nextSection();
						// Continue with the previous heading from before the index track.
						currentSection.heading = previousHeading;
						break;
					}
				}
				pushTrack(track);
				break;
			case 'track':
				pushTrack(track);
				break;
			default:
				throw new ProviderError('Discogs', `Unsupported track type '${track.type_}'`);
		}
	}
	// Store last section unless it is empty.
	if (currentSection.tracks.length) {
		sections.push(currentSection);
	}

	return sections;

	/** Starts a new section unless the current section is empty. */
	function nextSection() {
		if (currentSection.tracks.length) {
			sections.push(currentSection);
			currentSection = {
				tracks: [],
				type: 'track group',
				// Continue with the previous prefix.
				hasMediumPrefix: currentSection.hasMediumPrefix,
				positionPrefix: currentSection.positionPrefix,
			};
		}
	}

	/** Adds the given track to the current section or a new section when the position prefix changes. */
	function pushTrack(track: Track) {
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
	}

	function updateCurrentPositionPrefix(trackPosition: string) {
		const mediumPrefix = trackPosition.match(/^(CD|DVD|BR)?\d+-(?=\d)/)?.[0];
		if (mediumPrefix) {
			currentSection.type = 'medium';
			currentSection.hasMediumPrefix = true;
			currentSection.positionPrefix = new RegExp(String.raw`^${mediumPrefix}(?=\d)`);
			return;
		}

		const sidePrefix = trackPosition.match(/^[A-Z]+(?=\d|$)/)?.[0];
		if (sidePrefix) {
			currentSection.type = 'side';
			currentSection.hasMediumPrefix = false;
			currentSection.positionPrefix = new RegExp(String.raw`^${sidePrefix}(?=\d|$)`);
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
				};
				break;
			case 'side':
				if (currentMedium.sections.length) {
					const currentSideCount = currentMedium.sections.filter((section) => section.type === 'side').length;
					// Store previous medium if it already has two sides or only non-side sections.
					if (currentSideCount === 2 || currentSideCount === 0) {
						media.push(currentMedium);
						currentMedium = { sections: [] };
					}
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

	for (const medium of media) {
		// If there is only one section heading on a medium, use it as medium title instead.
		if (!medium.title) {
			const uniqueSectionHeadings = new Set(medium.sections.map((section) => section.heading));
			if (uniqueSectionHeadings.size === 1) {
				medium.title = medium.sections[0].heading;
				for (const section of medium.sections) {
					section.heading = undefined;
				}
			}
		}
	}

	return media;
}

function commonIndexPositionPrefix(trackPositions: Iterable<string>) {
	let commonPrefix: string | undefined;
	for (const trackPosition of trackPositions) {
		const indexPosition = splitIndexPosition(trackPosition);
		if (indexPosition) {
			if (commonPrefix) {
				if (indexPosition.prefix !== commonPrefix) {
					return undefined;
				}
			} else {
				commonPrefix = indexPosition.prefix;
			}
		} else {
			return undefined;
		}
	}
	return commonPrefix;
}

function splitIndexPosition(trackPosition: string) {
	const indexMatch = trackPosition.match(/^(.*\d)([a-z]|\.\d+)$/);
	if (indexMatch) {
		return {
			prefix: indexMatch[1],
			suffix: indexMatch[2],
		};
	}
}

function cleanHeading(heading: string): string {
	return heading.replace(/:$/, '');
}
