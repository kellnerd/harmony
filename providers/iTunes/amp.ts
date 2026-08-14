// Helpers for the unofficial Apple Music catalog (AMP) API.
// Metadata is loaded from amp-api.music.apple.com; music.apple.com is only used to obtain a JWT.
import { decodeBase64 } from 'std/encoding/base64.ts';
import type { AmpAlbum, AmpArtist, AmpDocument, AmpTrack } from './amp_types.ts';

// JWT as embedded in Apple Music / MusicKit assets.
const jwtPattern = /["'](eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)["']/g;

// Returns the JWT with the latest expiry when a page or script embeds more than one token.
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

// Script URLs that typically contain the MusicKit developer token.
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

// AMP pagination `next` is often a path (`/v1/catalog/...`), not an absolute URL.
export function resolveAmpUrl(next: string, apiBaseUrl: string): URL {
	if (next.startsWith('http://') || next.startsWith('https://')) {
		return new URL(next);
	}
	return new URL(next, apiBaseUrl);
}

export function isAmpTrack(resource: AmpAlbum | AmpTrack | AmpArtist): resource is AmpTrack {
	return resource.type === 'songs' || resource.type === 'music-videos';
}

// Collects tracks from an AMP page.
// Relationships may only list IDs; full objects (name, ISRC, duration) are often in `included`.
export function collectAmpTracks(body: AmpDocument, album?: AmpAlbum): AmpTrack[] {
	const includedTracks = (body.included ?? []).filter(isAmpTrack);
	const byId = new Map(includedTracks.map((track) => [track.id, track] as const));
	const hydrate = (partial: AmpTrack[]) =>
		partial.map((track) => track.attributes ? track : (byId.get(track.id) ?? track));

	if (album) {
		return hydrate(album.relationships?.tracks?.data ?? []);
	}
	return hydrate((body.data ?? []).filter(isAmpTrack));
}
