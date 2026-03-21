// server/api.ts
// Read-only HTTP API for Harmony (mvp-18)
// Fixed: proper extraction of MBID, barcode, and provider URLs from HarmonyRelease structure

import { CombinedReleaseLookup } from '@/lookup.ts';
import { defaultProviderPreferences } from '@/providers/mod.ts';

import type { HarmonyRelease, ProviderReleaseErrorMap } from '@/harmonizer/types.ts';

type JSONVal = Record<string, unknown> | Array<unknown> | string | number | boolean | null;

function json(data: JSONVal, init: ResponseInit = {}) {
	const hdr = new Headers(init.headers || {});
	if (!hdr.has('content-type')) hdr.set('content-type', 'application/json; charset=utf-8');
	return new Response(JSON.stringify(data), { ...init, headers: hdr });
}
function ok(data: JSONVal) {
	return json(data, { status: 200 });
}
function bad(msg: string, status = 400) {
	return json({ error: msg }, { status });
}

/**
 * Extract MBID from a HarmonyRelease.
 * The MBID is stored in releaseGroup.mbid after MBID resolution.
 */
function extractMbid(release: HarmonyRelease): string | null {
	// Primary location: release group MBID (populated by MBID resolver)
	if (release.releaseGroup?.mbid) {
		return release.releaseGroup.mbid;
	}

	// Fallback: check if MusicBrainz provider returned data
	const mbProvider = release.info.providers.find((p) => p.internalName === 'musicbrainz');
	if (mbProvider?.id) {
		return mbProvider.id;
	}

	return null;
}

/**
 * Extract barcode (GTIN) from a HarmonyRelease.
 * GTIN can be number or string, so handle both.
 */
function extractBarcode(release: HarmonyRelease): string | null {
	const gtin = release.gtin;
	if (gtin === undefined || gtin === null) return null;

	// Convert to string (handles both number and string types)
	const str = String(gtin).trim();
	return str || null;
}

/**
 * Extract track count information from a HarmonyRelease.
 */
function extractTrackInfo(release: HarmonyRelease): { mediaCount: number; trackCounts: number[]; totalTracks: number } {
	const trackCounts = release.media.map((m) => m.tracklist.length);
	const totalTracks = trackCounts.reduce((sum, c) => sum + c, 0);
	return {
		mediaCount: release.media.length,
		trackCounts,
		totalTracks,
	};
}

/**
 * Extract provider information from the provider release mapping.
 */
function extractProviders(
	providerMap: ProviderReleaseErrorMap,
): Array<{ service: string; url?: string; error?: string }> {
	const out: Array<{ service: string; url?: string; error?: string }> = [];

	for (const [serviceName, releaseOrError] of Object.entries(providerMap)) {
		if (releaseOrError instanceof Error) {
			out.push({ service: serviceName, error: releaseOrError.message });
			continue;
		}

		// It's a HarmonyRelease - get URL from externalLinks or provider info
		const release = releaseOrError as HarmonyRelease;
		const url = release.externalLinks[0]?.url || release.info.providers[0]?.url;
		out.push({ service: serviceName, url });
	}

	return out;
}

/**
 * Serialize a HarmonyRelease to a JSON-friendly format.
 */
function serializeRelease(release: HarmonyRelease) {
	const trackInfo = extractTrackInfo(release);

	return {
		title: release.title,
		artists: release.artists.map((a) => ({
			name: a.name,
			creditedName: a.creditedName,
			joinPhrase: a.joinPhrase,
			mbid: a.mbid,
		})),
		gtin: release.gtin ? String(release.gtin) : null,
		mbid: extractMbid(release),
		releaseDate: release.releaseDate,
		labels: release.labels?.map((l) => ({
			name: l.name,
			catalogNumber: l.catalogNumber,
			mbid: l.mbid,
		})),
		types: release.types,
		status: release.status,
		packaging: release.packaging,
		media: release.media.map((m) => ({
			number: m.number,
			format: m.format,
			title: m.title,
			trackCount: m.tracklist.length,
			tracks: m.tracklist.map((t) => ({
				number: t.number,
				title: t.title,
				length: t.length,
				isrc: t.isrc,
				artists: t.artists?.map((a) => ({
					name: a.name,
					creditedName: a.creditedName,
					joinPhrase: a.joinPhrase,
				})),
			})),
		})),
		mediaCount: trackInfo.mediaCount,
		totalTracks: trackInfo.totalTracks,
		trackCounts: trackInfo.trackCounts,
		externalLinks: release.externalLinks,
		images: release.images,
		availableIn: release.availableIn,
		copyright: release.copyright,
		language: release.language,
		providers: release.info.providers.map((p) => ({
			name: p.name,
			internalName: p.internalName,
			id: p.id,
			url: p.url,
			apiUrl: p.apiUrl,
		})),
		messages: release.info.messages,
	};
}

interface LookupResult {
	merged: HarmonyRelease;
	providerMap: ProviderReleaseErrorMap;
}

/**
 * Lookup by URL using only the matching provider (no cross-provider merge).
 * This avoids GTIN conflicts when different providers have different editions.
 */
async function lookupByUrlSingle(urlString: string): Promise<LookupResult> {
	const u = new URL(urlString);
	const input = { urls: [u] };
	const options = {
		withSeparateMedia: true,
		withAllTrackArtists: true,
		withISRC: true,
	};

	const lookup = new CombinedReleaseLookup(input, options);
	// Only get the provider mapping, don't try to merge with other providers
	const providerMap = await lookup.getProviderReleaseMapping();

	// Get the single release directly (no cross-provider GTIN lookup)
	const releases = Object.values(providerMap).filter((r): r is HarmonyRelease => !(r instanceof Error));
	if (releases.length === 0) {
		throw new Error('No release found');
	}

	return { merged: releases[0], providerMap };
}

/**
 * Lookup by URL with full cross-provider merge.
 * May fail if providers return conflicting GTINs.
 */
async function lookupByUrl(urlString: string, merge = false): Promise<LookupResult> {
	if (!merge) {
		return lookupByUrlSingle(urlString);
	}

	const u = new URL(urlString);
	const input = { urls: [u] };
	const options = {
		withSeparateMedia: true,
		withAllTrackArtists: true,
		withISRC: true,
	};

	const lookup = new CombinedReleaseLookup(input, options);
	const providerMap = await lookup.getCompleteProviderReleaseMapping();
	const merged = await lookup.getMergedRelease(defaultProviderPreferences);

	return { merged, providerMap };
}

async function lookupByGtin(gtin: string): Promise<LookupResult> {
	const input = { gtin };
	const options = {
		withSeparateMedia: true,
		withAllTrackArtists: true,
		withISRC: true,
	};

	const lookup = new CombinedReleaseLookup(input, options);
	const providerMap = await lookup.getCompleteProviderReleaseMapping();
	const merged = await lookup.getMergedRelease(defaultProviderPreferences);

	return { merged, providerMap };
}

type RouteHandler = (req: Request, url: URL) => Promise<Response> | Response;

const routes: Record<string, Record<string, RouteHandler>> = {
	'/api/health': {
		GET: () => ok({ ok: true, version: 'mvp-20', timestamp: new Date().toISOString() }),
	},

	'/api/v1/lookup': {
		GET: async (_req, url) => {
			const urlParam = url.searchParams.get('url');
			const gtinParam = url.searchParams.get('gtin') || url.searchParams.get('barcode');
			const merge = url.searchParams.get('merge') === 'true';

			if (!urlParam && !gtinParam) {
				return bad('url or gtin/barcode parameter required');
			}

			try {
				const result = urlParam ? await lookupByUrl(urlParam, merge) : await lookupByGtin(gtinParam!);

				return ok({
					release: serializeRelease(result.merged),
					providers: extractProviders(result.providerMap),
					source: 'harmony',
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				return bad(msg, 500);
			}
		},
	},

	'/api/v1/match': {
		GET: async (_req, url) => {
			const urlParam = url.searchParams.get('url');
			const gtinParam = url.searchParams.get('gtin') || url.searchParams.get('barcode');
			const merge = url.searchParams.get('merge') === 'true';

			if (!urlParam && !gtinParam) {
				return bad('url or gtin/barcode parameter required');
			}

			try {
				const { merged, providerMap } = urlParam ? await lookupByUrl(urlParam, merge) : await lookupByGtin(gtinParam!);
				const providers = extractProviders(providerMap);
				const trackInfo = extractTrackInfo(merged);

				const candidate = {
					mbid: extractMbid(merged),
					barcode: extractBarcode(merged),
					title: merged.title,
					artist: merged.artists.map((a) => a.creditedName || a.name).join(', '),
					trackCount: trackInfo.totalTracks,
					mediaCount: trackInfo.mediaCount,
					score: 1.0,
					evidence: ['harmony-lookup'],
				};

				return ok({
					input_url: urlParam || null,
					input_gtin: gtinParam || null,
					candidates: [candidate],
					best: candidate,
					providers,
					source: 'harmony',
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				return bad(msg, 500);
			}
		},
	},

	'/api/v1/barcode': {
		GET: async (_req, url) => {
			const urlParam = url.searchParams.get('url');
			const gtinParam = url.searchParams.get('gtin') || url.searchParams.get('barcode');
			const merge = url.searchParams.get('merge') === 'true';

			if (!urlParam && !gtinParam) {
				return bad('url or gtin/barcode parameter required');
			}

			try {
				const result = urlParam ? await lookupByUrl(urlParam, merge) : await lookupByGtin(gtinParam!);

				const trackInfo = extractTrackInfo(result.merged);

				return ok({
					mbid: extractMbid(result.merged),
					barcode: extractBarcode(result.merged),
					title: result.merged.title,
					artist: result.merged.artists.map((a) => a.creditedName || a.name).join(', '),
					trackCount: trackInfo.totalTracks,
					mediaCount: trackInfo.mediaCount,
					source: 'harmony',
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				return bad(msg, 500);
			}
		},
	},

	'/api/v1/providers': {
		GET: async (_req, url) => {
			const urlParam = url.searchParams.get('url');
			const gtinParam = url.searchParams.get('gtin') || url.searchParams.get('barcode');
			const merge = url.searchParams.get('merge') === 'true';

			if (!urlParam && !gtinParam) {
				return bad('url or gtin/barcode parameter required');
			}

			try {
				const { merged, providerMap } = urlParam ? await lookupByUrl(urlParam, merge) : await lookupByGtin(gtinParam!);

				return ok({
					mbid: extractMbid(merged),
					barcode: extractBarcode(merged),
					providers: extractProviders(providerMap),
					source: 'harmony',
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				return bad(msg, 500);
			}
		},
	},

	'/api/v1/tracks': {
		GET: async (_req, url) => {
			const urlParam = url.searchParams.get('url');
			const gtinParam = url.searchParams.get('gtin') || url.searchParams.get('barcode');
			const merge = url.searchParams.get('merge') === 'true';

			if (!urlParam && !gtinParam) {
				return bad('url or gtin/barcode parameter required');
			}

			try {
				const result = urlParam ? await lookupByUrl(urlParam, merge) : await lookupByGtin(gtinParam!);

				const release = result.merged;
				const trackInfo = extractTrackInfo(release);

				return ok({
					mbid: extractMbid(release),
					barcode: extractBarcode(release),
					title: release.title,
					artist: release.artists.map((a) => a.creditedName || a.name).join(', '),
					mediaCount: trackInfo.mediaCount,
					totalTracks: trackInfo.totalTracks,
					trackCounts: trackInfo.trackCounts,
					media: release.media.map((m) => ({
						number: m.number,
						format: m.format,
						title: m.title,
						trackCount: m.tracklist.length,
						tracks: m.tracklist.map((t) => ({
							number: t.number,
							title: t.title,
							length: t.length,
							lengthFormatted: t.length ? formatDuration(t.length) : null,
							isrc: t.isrc,
							artists: t.artists?.map((a) => a.creditedName || a.name).join(', '),
						})),
					})),
					source: 'harmony',
				});
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				return bad(msg, 500);
			}
		},
	},
};

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function handleRequest(req: Request): Promise<Response> | Response {
	const url = new URL(req.url);
	const routeHandlers = routes[url.pathname];

	if (!routeHandlers) {
		return new Response(null, { status: 404 });
	}

	const handler = routeHandlers[req.method];
	if (!handler) {
		return new Response(null, { status: 405 });
	}

	return handler(req, url);
}

export function startApi(port: number, host = '127.0.0.1') {
	console.log(`Starting Harmony API server on http://${host}:${port}`);
	return Deno.serve({ hostname: host, port }, handleRequest);
}

// Allow running directly: deno run -A server/api.ts
if (import.meta.main) {
	const port = parseInt(Deno.env.get('HARMONY_API_PORT') || '5221');
	const host = Deno.env.get('HARMONY_API_HOST') || '127.0.0.1';
	startApi(port, host);
}
