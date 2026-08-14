import { assertEquals } from 'std/assert/assert_equals.ts';
import { describe, it } from '@std/testing/bdd';
import { collectAmpTracks, extractAppleMusicJwt, extractScriptUrls, parseJwtExpiry, resolveAmpUrl } from './amp.ts';

function makeJwt(exp: number): string {
	const encode = (value: object) =>
		btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
	return `${encode({ alg: 'ES256', typ: 'JWT' })}.${encode({ exp })}.sig`;
}

describe('Apple Music AMP helpers', () => {
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
		const tracks = collectAmpTracks({
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

	it('resolves relative AMP pagination URLs', () => {
		const next = resolveAmpUrl(
			'/v1/catalog/au/albums/1/tracks?offset=10',
			'https://amp-api.music.apple.com',
		);
		assertEquals(next.href, 'https://amp-api.music.apple.com/v1/catalog/au/albums/1/tracks?offset=10');
	});
});
