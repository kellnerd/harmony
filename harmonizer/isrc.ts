import { assert } from 'std/assert/assert.ts';
import type { HarmonyRelease } from './types.ts';

const isrcPattern = /^([A-Z]{2})-?([A-Z0-9]{3})-?(\d{2})-?(\d{5})$/;

/** Normalized ISRC (International Standard Recording Code). */
export class ISRC {
	readonly country: string;
	readonly registrant: string;
	readonly year: string;
	readonly designation: string;
	readonly raw: string;

	constructor(code: string) {
		this.raw = code.trim();
		const isrcMatch = this.raw.toUpperCase().match(isrcPattern);
		assert(isrcMatch, 'Invalid ISRC code or unrecognized format');
		[this.country, this.registrant, this.year, this.designation] = isrcMatch.slice(1);
	}

	/** Formats the ISRC using the given separator, which defaults to a hyphen. */
	format(separator = '-'): string {
		return [this.country, this.registrant, this.year, this.designation].join(separator);
	}

	/** Returns the normalized string representation of the ISRC without separators. */
	toString(): string {
		return this.format('');
	}
}

/**
 * Normalizes the given ISRC code.
 *
 * Valid codes are converted to uppercase and stripped of optional hyphens and whitespace.
 * Returns `undefined` for invalid or unrecognized codes.
 */
export function normalizeISRC(code: string): string | undefined {
	try {
		const isrc = new ISRC(code);
		return isrc.toString();
	} catch {
		return;
	}
}

/**
 * Normalizes the ISRCs for all tracks of the given release.
 * Preserves invalid or unrecognized ISRCs as is.
 */
export function normalizeReleaseISRCs(release: HarmonyRelease) {
	release.media.flatMap((medium) => medium.tracklist).forEach((track) => {
		const { isrc } = track;
		if (isrc) {
			track.isrc = normalizeISRC(isrc) ?? isrc;
		}
	});
}
