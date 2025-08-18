import { isDefined } from '@/utils/predicate.ts';
import { assert } from 'std/assert/assert.ts';
import type { ReleaseInfo } from './types.ts';

/** Asserts that the given number is a valid timestamp. */
export function assertTimestamp(ts: number) {
	assert(Number.isSafeInteger(ts) && ts >= 0, 'Timestamp has to be a non-negative integer');
}

/** Formats the given timestamp as ISO YYYY-MM-DD date. */
export function formatTimestampAsISODate(unixSeconds: number): string {
	return new Date(unixSeconds * 1000).toISOString().substring(0, 10);
}

/** Formats the given timestamp as ISO YYYY-MM-DDTHH:mm:ssZ string. */
export function formatTimestampAsISOString(unixSeconds: number): string {
	return new Date(unixSeconds * 1000).toISOString().replace('.000', '');
}

/** Returns the date and time when the whole data from all providers was cached (in seconds since the UNIX epoch). */
export function getMaxCacheTimestamp(info: ReleaseInfo): number | undefined {
	const cacheTimestamps = info.providers.map((provider) => provider.cacheTime).filter(isDefined);
	const maxTimestamp = Math.max(...cacheTimestamps);
	if (Number.isSafeInteger(maxTimestamp)) {
		return maxTimestamp;
	}
}
