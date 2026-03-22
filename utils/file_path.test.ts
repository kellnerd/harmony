import { urlToFilePath } from './file_path.ts';

import { assert } from 'std/assert/assert.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { assertNotEquals } from 'std/assert/assert_not_equals.ts';
import { SEPARATOR } from 'std/path/constants.ts';
import { describe, it } from '@std/testing/bdd';

// Helper to construct URLs and make paths independent from the OS which runs the tests
async function urlToPathSegments(url: string, segmentMaxLength = 64) {
	const actualPath = await urlToFilePath(new URL(url), { segmentMaxLength });
	return actualPath.split(SEPARATOR);
}

describe('urlToFilePath', () => {
	it('replaces illegal filename characters with "!"', async () => {
		assertEquals(
			await urlToPathSegments('protocol://domain/path?key=value&id=42#hash'),
			['protocol!', 'domain', 'path!key=value&id=42#hash'],
		);
	});

	it('reverses domain names', async () => {
		assertEquals(
			await urlToPathSegments('https://test.example.org:8080/'),
			['https!', 'org.example.test!8080'],
		);
	});

	it('does not reverse IPv4 addresses', async () => {
		assertEquals(
			await urlToPathSegments('http://123.45.67.89'),
			['http!', '123.45.67.89'],
		);
	});

	it('shortens overlong path segments', async () => {
		const maxLength = 20;
		const pathSegments = await urlToPathSegments(
			'https://example.com/all-work-and-no-play-makes-jack-a-dull-boy',
			maxLength,
		);
		assert(pathSegments.every((segment) => segment.length <= maxLength));
		assertEquals(pathSegments, ['https!', 'com.example', 'all-work-and#65383ca']);
	});

	it('decodes URI components', async () => {
		assertEquals(
			await urlToPathSegments('https://example.com/spaced%20path/tést?k€y=valµe#h%C3%A4sh'),
			['https!', 'com.example', 'spaced path', 'tést!k€y=valµe#häsh'],
		);
	});

	it('can avoid a name conflict between file and directory', async () => {
		const fileUrl = new URL('file:///resource');
		const folderUrl = new URL('file:///resource/');

		const filePath = await urlToFilePath(fileUrl);
		const folderPath = await urlToFilePath(folderUrl);
		assertEquals(filePath, folderPath, 'Paths conflict by default');

		const safeOptions = { ignoreTrailingSlash: false };
		const safeFilePath = await urlToFilePath(fileUrl, safeOptions);
		const safeFolderPath = await urlToFilePath(folderUrl, safeOptions);
		assertNotEquals(safeFilePath, safeFolderPath, 'Safe paths do not conflict');
		assertEquals(safeFolderPath, folderPath, 'Folder path is not affected by safe options');
		assertEquals(safeFilePath, folderPath + '!', 'Safe file path has a special suffix');
	});
});
