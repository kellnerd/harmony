/** Formats a copyright string, replacing (c) and (p) with the corresponding symbol.
 *
 * If expectedSymbol is given the symbol will be prepended if no other copyright symbol
 * is already present in the string.
 */
export function formatCopyrightSymbols(copyright: string, expectedSymbol: '©' | '℗' | undefined = undefined): string {
	copyright = copyright.replace(/\(c\)/i, '©').replace(/\(p\)/i, '℗');
	if (expectedSymbol && !copyright.includes('©') && !copyright.includes('℗')) {
		copyright = `${expectedSymbol} ${copyright}`;
	}
	return copyright;
}
