import { decodeBase64 } from 'std/encoding/base64.ts';
import type { CatalogAlbum, CatalogArtist, CatalogDocument, CatalogTrack } from './catalog_types.ts';

const jwtPattern = /["'](eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)["']/g;

export function extractAppleMusicJwt(source: string): string | undefined {
	const matches = source.matchAll(jwtPattern);
	let best: string | undefined;
	let bestExpiry = 0;
	for (const match of matches) {
		const token = match[1];
		const expiry = parseJwtExpiry(token) ?? 0;
		if (expiry > bestExpiry) {
			best = token;
			bestExpiry = expiry;
		}
	}
	return best;
}

export function parseJwtExpiry(token: string): number | undefined {
	try {
		const payloadPart = token.split('.')[1];
		if (!payloadPart) return undefined;
		const padded = payloadPart.replace(/-/g, '+').replace(/_/g, '/') +
			'='.repeat((4 - (payloadPart.length % 4)) % 4);
		const payload = JSON.parse(new TextDecoder().decode(decodeBase64(padded))) as { exp?: number };
		return typeof payload.exp === 'number' ? payload.exp * 1000 : undefined;
	} catch {
		return undefined;
	}
}

export function extractScriptUrls(html: string): string[] {
	const urls: string[] = [];
	const seen = new Set<string>();
	const patterns = [
		/<script[^>]*\bcrossorigin\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi,
		/<script[^>]*\bsrc=["']([^"']+)["'][^>]*\bcrossorigin\b[^>]*>/gi,
		/<script[^>]*\bsrc=["']([^"']*musickit[^"']*)["'][^>]*>/gi,
	];
	for (const pattern of patterns) {
		for (const match of html.matchAll(pattern)) {
			const src = match[1];
			if (!seen.has(src)) {
				seen.add(src);
				urls.push(src);
			}
		}
	}
	return urls;
}

export function resolveCatalogUrl(next: string, apiBaseUrl: string): URL {
	if (next.startsWith('http://') || next.startsWith('https://')) {
		return new URL(next);
	}
	return new URL(next, apiBaseUrl);
}

export function isCatalogTrack(
	resource: CatalogAlbum | CatalogTrack | CatalogArtist,
): resource is CatalogTrack {
	return resource.type === 'songs' || resource.type === 'music-videos';
}

export function collectCatalogTracks(body: CatalogDocument, album?: CatalogAlbum): CatalogTrack[] {
	const includedTracks = (body.included ?? []).filter(isCatalogTrack);
	const byId = new Map(includedTracks.map((track) => [track.id, track] as const));
	const hydrate = (partial: CatalogTrack[]) =>
		partial.map((track) => track.attributes ? track : (byId.get(track.id) ?? track));

	if (album) {
		return hydrate(album.relationships?.tracks?.data ?? []);
	}
	return hydrate((body.data ?? []).filter(isCatalogTrack));
}

export function catalogArtworkUrl(
	artwork?: { url: string; width?: number; height?: number },
	size?: number,
): string | undefined {
	if (!artwork?.url) return undefined;
	const width = size ?? artwork.width ?? 3000;
	const height = size ?? artwork.height ?? 3000;
	return artwork.url.replace('{w}', String(width)).replace('{h}', String(height));
}
