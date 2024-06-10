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

/** Guesses a release type from a title. */
export function guessTypesFromTitle(title: string): Set<ReleaseGroupType> {
	const match = title.match(/ \((EP|Single|Live)\)$/i);
	const types = new Set<ReleaseGroupType>();
	if (match) {
		const type = match[1];
		types.add(type.charAt(0).toUpperCase() + type.slice(1) as ReleaseGroupType);
	}
	return types;
}

/** Returns true if all track titles indicate a live release. */
export function guessLiveRelease(tracks: HarmonyTrack[]): boolean {
	return tracks?.length > 0 && tracks.every((track) => {
		const types = guessTypesFromTitle(track.title);
		return types.has('Live');
	});
}
