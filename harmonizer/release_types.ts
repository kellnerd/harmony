import { HarmonyMedium, HarmonyRelease, HarmonyTrack, ReleaseGroupType } from './types.ts';
import { primaryTypeIds } from '@kellnerd/musicbrainz/data/release-group';

/** Guess the types for a release from release and track titles. */
export function guessTypesForRelease(release: HarmonyRelease): Iterable<ReleaseGroupType> {
	let types = new Set(release.types);
	types = types.union(guessTypesFromTitle(release.title));
	if (!types.has('Live') && guessLiveRelease(release.media.flatMap((media) => media.tracklist))) {
		types.add('Live');
	}
	if (!types.has('DJ-mix') && guessDjMixRelease(release.media)) {
		types.add('DJ-mix');
	}
	return types;
}

const releaseGroupTypeMatchers: Array<{ type?: ReleaseGroupType; pattern: RegExp }> = [
	// Commonly used for Bandcamp releases
	{ pattern: /\s\((EP|Single|Live|Demo)\)(?:\s\(.*?\))?$/i },
	// iTunes singles and EPs
	{ pattern: /\s- (EP|Single|Live)(?:\s\(.*?\))?$/i },
	// Generic "EP" suffix
	{ pattern: /\s(EP)(?:\s\(.*?\))?$/i },
	// Common remix title: "Remixed", "The Remixes", or "<Track name> (<Remixer> remix)".
	{ pattern: /\b(Remix)(?:e[sd])?\b/i },
	// Common DJ-mix titles
	{ type: 'DJ-mix', pattern: /\bContinuous DJ[\s-]Mix\b|[\(\[]DJ[\s-]mix[\)\]]/i },
	// Common soundtrack title: "Official/Original <Medium> Soundtrack" and "Original Score"
	{
		type: 'Soundtrack',
		pattern: /(?:Original|Official)(?:.*?)(?:Soundtrack|Score)/i,
	},
	// Common soundtrack title: "Soundtrack from the <Medium>", should also match "Soundtrack from the <Streaming service> <Medium>"
	{
		type: 'Soundtrack',
		pattern:
			/(?:Soundtrack|Score|Music)\s(?:(?:from|to) the)\s(?:.+[\s-])?(?:(?:Video\s)?Game|Motion Picture|Film|Movie|(?:(?:TV|Television)[\s-]?)?(?:Mini[\s-]?)?Series|Musical)/i,
	},
	// Common soundtrack title. Starting or ending with O.S.T. or OST (with or without wrapping parenthesis). Note: it's case sensitive.
	{
		type: 'Soundtrack',
		pattern: /(?:^(?:\(O\.S\.T\.\)|O\.S\.T\.|OST|\(OST\))\s.+|.+\s(?:\(O\.S\.T\.\)|O\.S\.T\.|OST|\(OST\))$)/,
	},
	// Common musical soundtrack release titles
	{ type: 'Soundtrack', pattern: /Original (?:.+\s)?Cast Recording/i },
	// Common German soundtrack release titles
	{
		type: 'Soundtrack',
		pattern: /(?:Soundtrack|Musik)\s(?:zum|zur)\s(?:.+[\s-])?(?:(?:Kino)?Film|Theaterstück|(?:TV[\s-]?)?Serie)/i,
	},
	// Common Swedish soundtrack release titles
	{
		type: 'Soundtrack',
		pattern:
			/(?:Soundtrack|Musik(?:en)?)\s(?:från|till|ur)\s(?:.+[\s-])?(?:Film(?:en)?|(?:TV[\s-]?)?(?:Mini[\s-]?)?Serien?|Musikalen)/i,
	},
	// Common Norwegian soundtrack release titles
	{ type: 'Soundtrack', pattern: /Musikk(?:en)? (?:fra) (?:Filmen|TV[\s-]serien|(?:teater)?forestillingen)/i },
];

/** Guesses a release type from a title. */
export function guessTypesFromTitle(title: string): Set<ReleaseGroupType> {
	const types = new Set<ReleaseGroupType>();
	releaseGroupTypeMatchers.forEach((matcher) => {
		if (matcher.type && types.has(matcher.type)) {
			// Release has already been assigned this type.
			return;
		}

		const match = title.match(matcher.pattern);
		if (!match) {
			return;
		}
		const type = match[1] || matcher.type;
		if (type) {
			types.add(capitalizeReleaseType(type));
		}
	});
	return types;
}

/**
 * Expression matching common live track name patterns.
 * Both `Track name - Live` and `Track name (Live)`.
 */
const liveTrackPattern = /\s(?:- Live|\(Live\))(?:\s\(.*?\))?$/i;

/** Returns true if all track titles indicate a live release. */
export function guessLiveRelease(tracks: HarmonyTrack[]): boolean {
	return tracks?.length > 0 && tracks.every((track) => {
		return liveTrackPattern.test(track.title);
	});
}

/**
 * Expression matching common DJ-mix track name patterns.
 * Support `Track name - Mixed`, `Track name (Mixed)`, and `Track name [Mixed]`.
 */
const djMixTrackPattern = /\s(?:- Mixed|\(Mixed\)|\[Mixed\])(?:\s\(.*?\))?$/i;

/**
 * Returns true if all track titles on at least one medium indicate a DJ-mix release.
 *
 * Some DJ-mix releases have both a medium with the mixed tracks and another with the unmixed tracks.
 */
export function guessDjMixRelease(media: HarmonyMedium[]): boolean {
	return media?.length > 0 && media.some((medium) => {
		const tracks = medium.tracklist;
		return tracks?.length > 0 && tracks.every((track) => {
			return djMixTrackPattern.test(track.title);
		});
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
