import { unescape } from 'std/html/entities.ts';

/** Extracts the first group of the given regex from HTML and decodes HTML entities. */
export function extractTextFromHtml(html: string, expression: RegExp) {
	const value = html.match(expression)?.[1];
	return value ? unescape(value) : undefined;
}

/**
 * Extracts the value of the data attribute with the given key from HTML.
 */
export function extractDataAttribute(html: string, key: string): string | undefined {
	return extractTextFromHtml(html, new RegExp(`data-${key}=["'](.+?)["']`, 'i'));
}

/** Extracts the `content` value of the meta tag with the given name from HTML. */
export function extractMetadataTag(html: string, name: string): string | undefined {
	return extractTextFromHtml(
		html,
		new RegExp(`<meta(?=[^>]+?[name|property]=["']${name}["'])[^>]+?content=["'](.+?)["']`, 'i'),
	);
}
