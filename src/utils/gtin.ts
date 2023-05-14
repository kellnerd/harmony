import type { GTIN } from '../harmonizer/types.ts';

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

/** Checks whether the given GTIN has an accepted format/length and a valid check digit. */
export function isValidGTIN(gtin: GTIN): boolean {
	gtin = gtin.toString();

	if (!gtinFormat.test(gtin) || !gtinLengths.includes(gtin.length)) {
		return false;
	}

	// the checksum of the whole code (including the check digit) has to be a multiple of 10
	return checksum(gtin) % 10 === 0;
}

/**
 * Calculates the check digit of the given GTIN, regardless of its length.
 * The check digit at the last position can be present or filled with an arbitrary placeholder.
 */
export function checkDigit(gtin: GTIN) {
	// replace check digit or placeholder with zero, which has no effect on the checksum
	gtin = gtin.toString().replace(/.$/, '0');

	return (10 - checksum(gtin) % 10) % 10;
}
