import { HarmonyRelease, HarmonyTrack, ReleaseGroupType } from './types.ts';
import { primaryTypeIds } from '@kellnerd/musicbrainz/data/release-group';

/** Guess the types for a release from release and track titles. */
export function guessTypesForRelease(release: HarmonyRelease) {
	let types = new Set<ReleaseGroupType>();
	if (release.types) {
		types = types.union(new Set(release.types));
	}
	types = types.union(guessTypesFromTitle(release.title));
	if (!types.has('Live') && guessLiveRelease(release.media.flatMap((media) => media.tracklist))) {
		types.add('Live');
	}
	release.types = sortTypes(types);
}

const detectTypesPatterns = [
	// Commonly used for Bandcamp releases
	/\s\((EP|Single|Live|Demo)\)(?:\s\(.*?\))?$/i,
	// iTunes singles and EPs
	/\s- (EP|Single|Live)(?:\s\(.*?\))?$/i,
	// Generic "EP" suffix
	/\s(EP)(?:\s\(.*?\))?$/i,
];

const typeMap: Map<string, ReleaseGroupType> = new Map([
	['demo', 'Demo'],
	['ep', 'EP'],
	['live', 'Live'],
	['single', 'Single'],
]);

/** Guesses a release type from a title. */
export function guessTypesFromTitle(title: string): Set<ReleaseGroupType> {
	const types = new Set<ReleaseGroupType>();
	detectTypesPatterns.forEach((pattern) => {
		const match = title.match(pattern);
		if (match) {
			const type = match[1].toLowerCase();
			types.add(typeMap.get(type) as ReleaseGroupType);
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

/** Converts a provider specific type to a `ReleaseGroupType` from a given mapping. */
export function convertReleaseType(
	sourceType: string,
	typeMap: Record<string, ReleaseGroupType>,
): ReleaseGroupType[] {
	const types: ReleaseGroupType[] = [];
	const type = typeMap[sourceType];
	if (type) {
		types.push(type);
	}
	return types;
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

const primaryTypes = Object.keys(primaryTypeIds);

function isPrimaryType(type: ReleaseGroupType): boolean {
	return primaryTypes.includes(type);
}
