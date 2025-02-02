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

/** Parses a duration in seconds from the given `m:s` or `H:m:s` string. */
export function parseDuration(time: string): number {
	const timeComponents = time.split(':').map(Number);
	const maxIndex = timeComponents.length - 1;
	return timeComponents.reduceRight((seconds, value, index) => seconds + value * (60 ** (maxIndex - index)));
}
