import { unescape } from 'std/html/entities.ts';

/** Extracts the first group of the given regex from HTML and decodes HTML entities. */
export function extractTextFromHtml(html: string, expression: RegExp) {
	const value = html.match(expression)?.[1];
	return value ? unescape(value) : undefined;
}

/** Extracts the value of the given attribute from the given HTML tag. */
export function extractAttribute(
	html: string,
	tagName: keyof HTMLElementTagNameMap,
	attribute: string,
): string | undefined {
	return extractTextFromHtml(html, new RegExp(`<${tagName}[^>]+?${attribute}=["']([^"']+?)["']`, 'i'));
}

/**
 * Extracts the value of the data attribute with the given key from HTML.
 */
export function extractDataAttribute(html: string, key: string): string | undefined {
	return extractTextFromHtml(html, new RegExp(`data-${key}=["'](.+?)["']`, 'is'));
}

/** Extracts the `content` value of the meta tag with the given name from HTML. */
export function extractMetadataTag(html: string, name: string): string | undefined {
	return extractTextFromHtml(
		html,
		new RegExp(`<meta(?=[^>]+?[name|property]=["']${name}["'])[^>]+?content=["'](.+?)["']`, 'i'),
	);
}

/** Extracts the content of the first div tag with the given class from HTML. */
export function extractDivWithClass(html: string, className: string): string | undefined {
	return next(extractDivsWithClass(html, className));
}

/** Extracts the content of all div tags with the given class from HTML. */
export function* extractDivsWithClass(html: string, className: string): Generator<string> {
	const matches = html.matchAll(
		new RegExp(`<div(?=[^>]+?class=["'][^"']*?\\b${className}\\b[^"']*?["'])[^>]+?>(.+)</div>`, 'gi'),
	);
	for (const match of matches) {
		yield match[1];
	}
}

/** Extracts the content of the span tag with the given class from HTML. */
export function extractSpanWithClass(html: string, className: string): string | undefined {
	return extractTextFromHtml(
		html,
		new RegExp(`<span(?=[^>]+?class=["'][^"']*?\\b${className}\\b[^"']*?["'])[^>]+?>(.+?)</span>`, 'i'),
	);
}

/** Extracts text content and link `href` from the first anchor tag in the given HTML. */
export function extractAnchorTag(html: string): AnchorTag | undefined {
	return next(extractAnchorTags(html));
}

/** Extracts text content and link `href` from every anchor tag in the given HTML. */
export function* extractAnchorTags(html: string): Generator<AnchorTag> {
	const matches = html.matchAll(/<a [^>]*?href=["'](?<href>.+?)["'][^>]*?>(?<text>.+?)<\/a>/gi);
	for (const match of matches) {
		const { href, text } = match.groups!;
		yield { href, text };
	}
}

/** Representation of an HTML anchor `<a>` tag. */
export interface AnchorTag {
	href: string;
	text: string;
}

/** Strips tags from the given HTML and decodes entities to return plain text. */
export function toText(html: string): string {
	return unescape(html.replaceAll(/<[^>]+>/g, ''));
}

function next<T>(generator: Generator<T>): T | undefined {
	const result = generator.next();
	return result.done ? undefined : result.value;
}
