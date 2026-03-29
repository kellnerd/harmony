import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';
import type { ReleaseFormat } from './api_types.ts';
import { extractMoreDetailsFromFormats } from './format.ts';

const exampleFormats = {
	vinylAlbum: {
		name: 'Vinyl',
		qty: '2',
		descriptions: ['LP', 'Album'],
	},
	bootlegCompilationCDs: {
		name: 'CD',
		qty: '3',
		descriptions: ['Compilation', 'Unofficial Release'],
	},
	digitalPromoSingle: {
		name: 'File',
		qty: '1',
		descriptions: ['Single', 'Promo'],
	},
	mixtape: {
		name: 'Cassette',
		qty: '1',
		descriptions: ['Mixtape'],
	},
} satisfies Record<string, ReleaseFormat>;

describe('extractMoreDetailsFromFormats', () => {
	it('detects Album and defaults to Official', () => {
		const { status, types } = extractMoreDetailsFromFormats([exampleFormats.vinylAlbum]);
		assertEquals(types, ['Album']);
		assertEquals(status, 'Official', 'Status defaults to Official');
	});

	it('detects Bootleg Compilation', () => {
		const { status, types } = extractMoreDetailsFromFormats([exampleFormats.bootlegCompilationCDs]);
		assertEquals(types, ['Compilation']);
		assertEquals(status, 'Bootleg');
	});

	it('detects Promo Single and sets digital packaging to None', () => {
		const { status, types, packaging } = extractMoreDetailsFromFormats([exampleFormats.digitalPromoSingle]);
		assertEquals(types, ['Single']);
		assertEquals(status, 'Promotion');
		assertEquals(packaging, 'None');
	});

	it('detects Mixtape', () => {
		const { types } = extractMoreDetailsFromFormats([exampleFormats.mixtape]);
		assertEquals(types, ['Mixtape/Street']);
	});
});
