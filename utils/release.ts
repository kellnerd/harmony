import { HarmonyRelease, HarmonyTrack, ReleaseGroupType } from '@/harmonizer/types.ts';

/** Guess the types for a release from release and track titles. */
export function guessTypesForRelease(release: HarmonyRelease) {
	let types = release.types || new Set();
	types = types.union(guessTypesFromTitle(release.title));
	if (!types.has('Live') && guessLiveRelease(release.media.flatMap((media) => media.tracklist))) {
		types.add('Live');
	}
	release.types = types;
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
): Set<ReleaseGroupType> {
	const types = new Set<ReleaseGroupType>();
	const type = typeMap[sourceType];
	if (type) {
		types.add(type);
	}
	return types;
}
