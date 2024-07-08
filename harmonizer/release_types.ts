import { HarmonyRelease, HarmonyTrack, ReleaseGroupType } from './types.ts';
import { primaryTypeIds } from '@kellnerd/musicbrainz/data/release-group';

/** Guess the types for a release from release and track titles. */
export function guessTypesForRelease(release: HarmonyRelease): Iterable<ReleaseGroupType> {
	let types = new Set(release.types);
	types = types.union(guessTypesFromTitle(release.title));
	if (!types.has('Live') && guessLiveRelease(release.media.flatMap((media) => media.tracklist))) {
		types.add('Live');
	}
	return types;
}

const detectTypesPatterns = [
	// Commonly used for Bandcamp releases
	/\s\((EP|Single|Live|Demo)\)(?:\s\(.*?\))?$/i,
	// iTunes singles and EPs
	/\s- (EP|Single|Live)(?:\s\(.*?\))?$/i,
	// Generic "EP" suffix
	/\s(EP)(?:\s\(.*?\))?$/i,
];

/** Guesses a release type from a title. */
export function guessTypesFromTitle(title: string): Set<ReleaseGroupType> {
	const types = new Set<ReleaseGroupType>();
	detectTypesPatterns.forEach((pattern) => {
		const match = title.match(pattern);
		if (match) {
			types.add(capitalizeReleaseType(match[1]));
		}
	});
	return types;
}

/** Returns true if all track titles indicate a live release. */
export function guessLiveRelease(tracks: HarmonyTrack[]): boolean {
	return tracks?.length > 0 && tracks.every((track) => {
		const types = guessTypesFromTitle(track.title);
		return types.has('Live');
	});
}

/** Takes a release type as a string and turns it into a [ReleaseGroupType]. */
export function capitalizeReleaseType(sourceType: string): ReleaseGroupType {
	const type = sourceType.toLowerCase();
	switch (type) {
		case 'ep':
			return 'EP';
		case 'dj-mix':
			return 'DJ-mix';
		case 'mixtape/street':
			return 'Mixtape/Street';
		default:
			return type.charAt(0).toUpperCase() + type.slice(1) as ReleaseGroupType;
	}
}

/** Returns a new array with the types sorted, primary types first and secondary types second. */
export function sortTypes(types: Iterable<ReleaseGroupType>): ReleaseGroupType[] {
	return Array.from(types).sort((a, b) => {
		if (a == b) {
			return 0;
		}

		const primaryA = isPrimaryType(a);
		const primaryB = isPrimaryType(b);

		if (primaryA && !primaryB) {
			return -1;
		} else if (!primaryA && primaryB) {
			return 1;
		} else {
			return a > b ? 1 : -1;
		}
	});
}

/** Takes several lists of types and returns a single array of unique, sorted types.
 *
 * The result is reduced to unique elements with only a single primary type.
 */
export function mergeTypes(...typeLists: Iterable<ReleaseGroupType>[]): ReleaseGroupType[] {
	const primaryTypes = new Set<ReleaseGroupType>();
	const resultTypes = new Set<ReleaseGroupType>();
	for (const types of typeLists) {
		for (const type of types) {
			if (isPrimaryType(type)) {
				primaryTypes.add(type);
			} else {
				resultTypes.add(type);
			}
		}
	}
	if (primaryTypes.size) {
		resultTypes.add(reducePrimaryTypes(Array.from(primaryTypes)));
	}
	return sortTypes(resultTypes);
}

const primaryTypes = Object.keys(primaryTypeIds);

function isPrimaryType(type: ReleaseGroupType): boolean {
	return primaryTypes.includes(type);
}

/** Reduce a list of primary types to a single type.
 */
function reducePrimaryTypes(types: Array<ReleaseGroupType>): ReleaseGroupType {
	return types.reduce((previous, current) => {
		if (previous == 'Album' || previous == 'Other') {
			// Prefer more specific types over Album or Other. Many providers use Album
			// as the generic type.
			return current;
		} else if (previous == 'Single' && current == 'EP') {
			// Prefer EP over Single
			return current;
		}

		// No specific preference, just use the first type found.
		return previous;
	});
}
