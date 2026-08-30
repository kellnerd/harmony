import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';
import {
	catalogArtworkUrl,
	collectCatalogTracks,
	extractAppleMusicJwt,
	extractScriptUrls,
	parseJwtExpiry,
	resolveCatalogUrl,
} from './catalog.ts';

function makeJwt(exp: number): string {
	const encode = (value: object) =>
		btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
	return `${encode({ alg: 'ES256', typ: 'JWT' })}.${encode({ exp })}.sig`;
}

describe('Apple Music catalog helpers', () => {
	it('extracts the JWT with the latest expiry', () => {
		const older = makeJwt(1_700_000_000);
		const newer = makeJwt(2_000_000_000);
		const source = `const a="${older}"; const b='${newer}';`;
		assertEquals(extractAppleMusicJwt(source), newer);
		assertEquals(parseJwtExpiry(newer), 2_000_000_000 * 1000);
	});

	it('extracts crossorigin and musickit script URLs', () => {
		const html = `
			<script crossorigin src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"></script>
			<script src="https://music.apple.com/assets/index.js" crossorigin></script>
			<script src="https://example.com/ignore.js"></script>
		`;
		assertEquals(extractScriptUrls(html), [
			'https://js-cdn.music.apple.com/musickit/v3/musickit.js',
			'https://music.apple.com/assets/index.js',
		]);
	});

	it('hydrates track stubs from included resources', () => {
		const tracks = collectCatalogTracks({
			data: [{
				id: '1',
				type: 'albums',
				attributes: { name: 'Mix', artistName: 'DJ' },
				relationships: {
					tracks: { data: [{ id: 't1', type: 'songs' }], next: '/v1/next' },
				},
			}],
			included: [{
				id: 't1',
				type: 'songs',
				attributes: { name: 'Track One', artistName: 'Artist', trackNumber: 1, discNumber: 1 },
			}],
		}, {
			id: '1',
			type: 'albums',
			attributes: { name: 'Mix', artistName: 'DJ' },
			relationships: {
				tracks: { data: [{ id: 't1', type: 'songs' }] },
			},
		});
		assertEquals(tracks[0].attributes?.name, 'Track One');
	});

	it('resolves relative catalog pagination URLs', () => {
		const next = resolveCatalogUrl(
			'/v1/catalog/au/albums/1/tracks?offset=10',
			'https://api.music.apple.com',
		);
		assertEquals(next.href, 'https://api.music.apple.com/v1/catalog/au/albums/1/tracks?offset=10');
	});

	it('fills artwork template dimensions', () => {
		assertEquals(
			catalogArtworkUrl({ url: 'https://example.com/{w}x{h}bb.jpg', width: 3000, height: 3000 }, 250),
			'https://example.com/250x250bb.jpg',
		);
	});
});
