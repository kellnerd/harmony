import type { FunctionSpec } from '@/utils/test_spec.ts';
import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';
import type { ReleaseFormat } from './api_types.ts';
import { convertFormat, extractMoreDetailsFromFormatsAndStyles } from './format.ts';

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
	boxset: {
		name: 'Box Set',
		qty: '1',
		descriptions: ['Special Edition'],
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

const formatConversionTests: FunctionSpec<typeof convertFormat> = [
	['File', exampleFormats.digitalPromoSingle, ['Digital Media']],
	['3x CD', exampleFormats.bootlegCompilationCDs, ['CD', 'CD', 'CD']],
	['2x Vinyl LP', exampleFormats.vinylAlbum, ['12" Vinyl', '12" Vinyl']],
	['Box Set', exampleFormats.boxset, []],
];

describe('convertFormat', () => {
	for (const [description, specifier, expectedFormats] of formatConversionTests) {
		it(description, () => assertEquals(convertFormat(specifier), expectedFormats));
	}
});

describe('extractMoreDetailsFromFormatsAndStyles', () => {
	it('detects Album and defaults to Official', () => {
		const { status, types } = extractMoreDetailsFromFormatsAndStyles([exampleFormats.vinylAlbum]);
		assertEquals(types, ['Album']);
		assertEquals(status, 'Official', 'Status defaults to Official');
	});

	it('detects Bootleg Compilation', () => {
		const { status, types } = extractMoreDetailsFromFormatsAndStyles([exampleFormats.bootlegCompilationCDs]);
		assertEquals(types, ['Compilation']);
		assertEquals(status, 'Bootleg');
	});

	it('detects Promo Single and sets digital packaging to None', () => {
		const { status, types, packaging } = extractMoreDetailsFromFormatsAndStyles([exampleFormats.digitalPromoSingle]);
		assertEquals(types, ['Single']);
		assertEquals(status, 'Promotion');
		assertEquals(packaging, 'None');
	});

	it('detects Mixtape', () => {
		const { types } = extractMoreDetailsFromFormatsAndStyles([exampleFormats.mixtape]);
		assertEquals(types, ['Mixtape/Street']);
	});

	it('detects Score Album as Soundtrack', () => {
		const { types } = extractMoreDetailsFromFormatsAndStyles([exampleFormats.vinylAlbum], ['Score']);
		assertEquals(types, ['Album', 'Soundtrack']);
	});

	it('deduplicates (mapped) release group types', () => {
		const { types } = extractMoreDetailsFromFormatsAndStyles([], ['Score', 'Soundtrack']);
		assertEquals(types, ['Soundtrack']);
	});

	it('detects Radioplay Broadcast as Audio Drama', () => {
		const { types } = extractMoreDetailsFromFormatsAndStyles([], ['Radioplay', 'Public Broadcast']);
		assertEquals(types, ['Audio drama', 'Broadcast']);
	});
});
