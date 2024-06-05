import { availableRegions } from './regions.ts';
import { type CacheEntry, MetadataProvider, type ProviderOptions, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { encodeBase64 } from 'std/encoding/base64.ts';

import type { Album, AlbumItem, ApiError, Artist, Image, Resource, Result, TokenResult } from './api_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
} from '@/harmonizer/types.ts';

// See https://developer.tidal.com/reference/web-api

const tidalClientId = Deno.env.get('HARMONY_TIDAL_CLIENT_ID') || '';
const tidalClientSecret = Deno.env.get('HARMONY_TIDAL_CLIENT_SECRET') || '';

export default class TidalProvider extends MetadataProvider {
	constructor(options: ProviderOptions = {}) {
		super({
			rateLimitInterval: 1000,
			concurrentRequests: 2,
			...options,
		});
	}

	readonly name = 'Tidal';

	readonly supportedUrls = new URLPattern({
		hostname: '{www.}?tidal.com',
		pathname: String.raw`/browse/:type(album|artist)/:id(\d+)`,
	});

	readonly features: FeatureQualityMap = {
		'cover size': 1280,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.GOOD,
		'MBID resolving': FeatureQuality.PRESENT,
		'release label': FeatureQuality.MISSING,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
	};

	readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = TidalReleaseLookup;

	readonly launchDate: PartialDate = {
		year: 2014,
		month: 10,
		day: 28,
	};

	readonly apiBaseUrl = 'https://openapi.tidal.com';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), 'https://www.tidal.com/browse/');
	}

	async query<Data>(apiUrl: URL, maxTimestamp?: number): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp },
			requestInit: {
				headers: {
					'Authorization': `Bearer ${await this.accessToken()}`,
					'Content-Type': 'application/vnd.tidal.v1+json',
				},
			},
		});
		const { error } = cacheEntry.content as { error?: ApiError };

		if (error) {
			throw new TidalResponseError(error, apiUrl);
		}
		return cacheEntry;
	}

	private async accessToken(): Promise<string> {
		// See https://developer.tidal.com/documentation/api-sdk/api-sdk-quick-start
		const url = new URL('https://auth.tidal.com/v1/oauth2/token');
		const auth = encodeBase64(`${tidalClientId}:${tidalClientSecret}`);
		const body = new URLSearchParams();
		body.append('grant_type', 'client_credentials');
		body.append('client_id', tidalClientId);

		const cacheEntry = await this.fetchJSON<TokenResult>(url, {
			requestInit: {
				method: 'POST',
				headers: {
					'Authorization': `Basic ${auth}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body,
			},
			policy: {
				maxAge: 60 * 60 * 24, // 24 hours
			},
		});

		return cacheEntry?.content?.access_token;
	}
}

export class TidalReleaseLookup extends ReleaseLookup<TidalProvider, Album> {
	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		let lookupUrl: URL;
		const query = new URLSearchParams({
			countryCode: region || 'US',
		});
		if (method === 'gtin') {
			lookupUrl = new URL(`/albums/byBarcodeId`, this.provider.apiBaseUrl);
			query.append('barcodeId', value);
		} else { // if (method === 'id')
			lookupUrl = new URL(`albums/${value}`, this.provider.apiBaseUrl);
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(): Promise<Album> {
		if (!this.lookup.region && this.options.regions && this.options.regions.size > 0) {
			this.lookup.region = [...this.options.regions][0];
		}

		const apiUrl = this.constructReleaseApiUrl();

		let cacheEntry, release;
		if (this.lookup.method === 'gtin') {
			cacheEntry = await this.provider.query<Result<Album>>(
				apiUrl,
				this.options.snapshotMaxTimestamp,
			);

			if (cacheEntry.content.data.length === 0) {
				throw new ResponseError(this.provider.name, 'API returned no results for this barcode', apiUrl);
			}
			release = cacheEntry.content.data[0].resource;
		} else { // if (method === 'id') {
			cacheEntry = await this.provider.query<Resource<Album>>(
				apiUrl,
				this.options.snapshotMaxTimestamp,
			);
			release = cacheEntry.content.resource;
		}

		this.updateCacheTime(cacheEntry.timestamp);
		return release;
	}

	private async getRawTracklist(albumId: string): Promise<AlbumItem[]> {
		const tracklist: AlbumItem[] = [];
		const url = new URL(`albums/${albumId}/items`, this.provider.apiBaseUrl);
		const limit = 100;
		let offset = 0;
		const query = new URLSearchParams({
			countryCode: this.lookup.region || 'US',
			limit: String(limit),
			offset: String(offset),
		});

		while (true) {
			url.search = query.toString();
			const { content, timestamp }: CacheEntry<Result<AlbumItem>> = await this.provider.query(
				url,
				this.options.snapshotMaxTimestamp,
			);
			tracklist.push(...content.data.map((r) => r.resource));
			if (!content.metadata.total || content.metadata.total <= tracklist.length) {
				break;
			}
			offset += limit;
			query.set('offset', String(offset));
			this.updateCacheTime(timestamp);
		}

		return tracklist;
	}

	protected async convertRawRelease(rawRelease: Album): Promise<HarmonyRelease> {
		this.id = rawRelease.id;
		const rawTracklist = await this.getRawTracklist(this.id);
		const media = this.convertRawTracklist(rawTracklist);
		return {
			title: rawRelease.title,
			artists: rawRelease.artists.map(this.convertRawArtist.bind(this)),
			gtin: rawRelease.barcodeId,
			externalLinks: [{
				url: new URL(rawRelease.tidalUrl),
				types: ['paid streaming'],
			}],
			media,
			releaseDate: parseHyphenatedDate(rawRelease.releaseDate),
			copyright: rawRelease.copyright,
			status: 'Official',
			packaging: 'None',
			images: this.getLargestCoverImage(rawRelease.imageCover),
			info: this.generateReleaseInfo(),
		};
	}

	private convertRawTracklist(tracklist: AlbumItem[]): HarmonyMedium[] {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		// split flat tracklist into media
		tracklist.forEach((item) => {
			// store the previous medium and create a new one
			if (item.volumeNumber !== medium.number) {
				if (medium.number) {
					result.push(medium);
				}

				medium = {
					number: item.volumeNumber,
					format: 'Digital Media',
					tracklist: [],
				};
			}

			medium.tracklist.push(this.convertRawTrack(item));
		});

		// store the final medium
		result.push(medium);

		return result;
	}

	private convertRawTrack(track: AlbumItem): HarmonyTrack {
		const result: HarmonyTrack = {
			number: track.trackNumber,
			title: track.title,
			length: track.duration * 1000,
			isrc: track.isrc,
			artists: track.artists.map(this.convertRawArtist.bind(this)),
		};

		return result;
	}

	private convertRawArtist(artist: Artist): ArtistCreditName {
		return {
			name: artist.name,
			creditedName: artist.name,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: artist.id.toString() }),
		};
	}

	private getLargestCoverImage(images: Image[]): Artwork[] {
		let largestImage: Image | undefined;
		let maxSize = 0;
		images.forEach((i) => {
			if (i.width > maxSize) {
				largestImage = i;
				maxSize = i.width;
			}
		});
		if (!largestImage) return [];
		return [{
			url: new URL(largestImage.url),
			types: ['front'],
		}];
	}
}

class TidalResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		const msg = details.errors.map((e) => `${e.field}: ${e.detail}`).join(', ');
		super('Tidal', msg, url);
	}
}
