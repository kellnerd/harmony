import type { GTIN } from '@/harmonizer/types.ts';

const gtinFormat = /^\d+$/;
const gtinLengths = [8, 12, 13, 14];

/** Calculates the checksum of the given (numeric) GTIN string, regardless of its length. */
function checksum(gtin: string) {
	const length = gtin.length;

	return gtin.split('')
		.map((digit) => Number(digit))
		// checksum factors alternate between 1 and 3, starting with 1 for the last digit
		.reduce((checksum, digit, index) => (checksum + digit * ((length - index) % 2 ? 1 : 3)), 0);
}

/** Asserts that the given GTIN has an accepted format/length and a valid check digit. */
export function ensureValidGTIN(gtin: GTIN): void {
	gtin = gtin.toString();

	if (!gtinLengths.includes(gtin.length)) {
		throw new TypeError(`GTIN '${gtin}' has an invalid length`);
	}

	if (!gtinFormat.test(gtin)) {
		throw new TypeError(`GTIN '${gtin}' contains invalid non-numeric characters`);
	}

	// the checksum of the whole code (including the check digit) has to be a multiple of 10
	if (checksum(gtin) % 10 !== 0) {
		throw new TypeError(`Checksum of GTIN '${gtin}' is invalid`);
	}
}

/** Checks whether the given GTIN has an accepted format/length and a valid check digit. */
export function isValidGTIN(gtin: GTIN): boolean {
	try {
		ensureValidGTIN(gtin);
	} catch {
		return false;
	}

	return true;
}

/**
 * Calculates the check digit of the given GTIN, regardless of its length.
 * The check digit at the last position has to be present or filled with an arbitrary placeholder.
 */
export function checkDigit(gtin: GTIN) {
	// replace check digit or placeholder with zero, which has no effect on the checksum
	gtin = gtin.toString().replace(/.$/, '0');

	return (10 - checksum(gtin) % 10) % 10;
}

/**
 * Compares two GTINs and returns whether they are identical.
 * Unless `strict` mode is enabled, leading zeros are ignored.
 */
export function isEqualGTIN(a: GTIN, b: GTIN, { strict = false } = {}): boolean {
	a = a.toString();
	b = b.toString();

	if (strict) {
		return a === b;
	} else {
		return Number(a) === Number(b);
	}
}

/** Returns the numeric set of all unique GTIN. */
export function uniqueGtinSet(gtins: GTIN[]): Set<number> {
	return new Set(gtins.map(Number));
}
