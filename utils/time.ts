import { assert } from 'std/assert/assert.ts';

export function formatDuration(ms: number | undefined, {
	showMs = false,
} = {}): string | undefined {
	if (ms === undefined) return;

	const timeComponents: number[] = [];

	const seconds = Math.floor(ms / 1000);
	timeComponents.unshift(seconds % 60);

	const minutes = Math.floor(seconds / 60);
	timeComponents.unshift(minutes % 60);

	const hours = Math.floor(minutes / 60);
	if (hours) {
		timeComponents.unshift(hours);
	}

	let duration = timeComponents.map((component, index) => {
		if (index) {
			// zero-pad all used time components except for the leading one
			return component.toString().padStart(2, '0');
		} else {
			return component;
		}
	}).join(':');

	ms %= 1000;
	if (ms || showMs) {
		duration += '.' + ms.toFixed(0).padStart(3, '0');
	}

	return duration;
}

export function formatTimestampAsISOString(unixSeconds: number): string {
	return new Date(unixSeconds * 1000).toISOString().replace('.000', '');
}

/** Asserts that the given number is a valid timestamp. */
export function assertTimestamp(ts: number) {
	assert(Number.isSafeInteger(ts) && ts >= 0, 'Timestamp has to be a non-negative integer');
}

/** Converts an ISO-8601 duration (e.g. PT41M5S) to milliseconds. */
export function parseISODuration(duration: string): number {
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) {
		return 0;
	}
	const hours = match[1] ? parseInt(match[1], 10) : 0;
	const minutes = match[2] ? parseInt(match[2], 10) : 0;
	const seconds = match[3] ? parseInt(match[3], 10) : 0;
	return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}
