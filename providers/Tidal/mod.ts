import { availableRegions } from './regions.ts';
import { type CacheEntry, MetadataProvider, type ProviderOptions, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { encodeBase64 } from 'std/encoding/base64.ts';

import type { Album, AlbumItem, ApiError, Image, Resource, Result, SimpleArtist } from './api_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	CountryCode,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label,
} from '@/harmonizer/types.ts';
import { pluralWithCount } from '../../utils/plural.ts';

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
		pathname: String.raw`{/browse}?/:type(album|artist)/:id(\d+)`,
	});

	readonly features: FeatureQualityMap = {
		'cover size': 1280,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.GOOD,
		'MBID resolving': FeatureQuality.PRESENT,
		'release label': FeatureQuality.BAD,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
	};

	readonly defaultRegion: CountryCode = 'US';

	readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = TidalReleaseLookup;

	readonly launchDate: PartialDate = {
		year: 2014,
		month: 10,
		day: 28,
	};

	readonly apiBaseUrl = 'https://openapi.tidal.com';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), 'https://tidal.com/');
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
		const cacheKey = `${this.name}:accessKey`;
		let tokenResult = JSON.parse(localStorage.getItem(cacheKey) || '{}');
		if (!tokenResult?.accessToken || Date.now() > tokenResult?.validUntil) {
			tokenResult = await this.requestAccessToken();
			localStorage.setItem(cacheKey, JSON.stringify(tokenResult));
		}
		return tokenResult.accessToken;
	}

	private async requestAccessToken(): Promise<{ accessToken: string; validUntil: number }> {
		// See https://developer.tidal.com/documentation/api-sdk/api-sdk-quick-start
		const url = new URL('https://auth.tidal.com/v1/oauth2/token');
		const auth = encodeBase64(`${tidalClientId}:${tidalClientSecret}`);
		const body = new URLSearchParams();
		body.append('grant_type', 'client_credentials');
		body.append('client_id', tidalClientId);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${auth}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body,
		});

		const content = await response.json();
		return {
			accessToken: content?.access_token,
			validUntil: Date.now() + (content.expires_in * 1000),
		};
	}
}

export class TidalReleaseLookup extends ReleaseLookup<TidalProvider, Album> {
	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		let lookupUrl: URL;
		const query = new URLSearchParams({
			countryCode: region || this.provider.defaultRegion,
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

	protected async queryAllRegions<Data>(
		dataValidator: (data: Data) => boolean,
		errorValidator: (error: unknown) => boolean = (_) => false,
	): Promise<Data> {
		for (const region of this.options.regions || [this.provider.defaultRegion]) {
			this.lookup.region = region;
			const apiUrl = this.constructReleaseApiUrl();
			try {
				const cacheEntry = await this.provider.query<Data>(
					apiUrl,
					this.options.snapshotMaxTimestamp,
				);
				if (dataValidator(cacheEntry.content)) {
					this.updateCacheTime(cacheEntry.timestamp);
					return cacheEntry.content;
				}
			} catch (error: unknown) {
				// Allow the caller to ignore exceptions and retry next region.
				if (!errorValidator(error)) {
					throw error;
				}
			}
		}

		// No results were found for any region.
		throw new ResponseError(this.provider.name, 'API returned no results', this.constructReleaseApiUrl());
	}

	protected async getRawRelease(): Promise<Album> {
		if (this.lookup.method === 'gtin') {
			const validator = (data: Result<Album>) => {
				return Boolean(data?.data?.length);
			};
			const result = await this.queryAllRegions<Result<Album>>(validator);
			return result.data[0].resource;
		} else {
			const validator = (data: Resource<Album>) => {
				return Boolean(data?.resource);
			};
			// If this was a 404 not found error, ignore it and try next region.
			const errorValidator = (error: unknown) => {
				const { response } = error as { response?: Response };
				return response?.status === 404;
			};
			const result = await this.queryAllRegions<Resource<Album>>(validator, errorValidator);
			return result.resource;
		}
	}

	private async getRawTracklist(albumId: string): Promise<AlbumItem[]> {
		const tracklist: AlbumItem[] = [];
		const url = new URL(`albums/${albumId}/items`, this.provider.apiBaseUrl);
		const limit = 100;
		let offset = 0;
		const query = new URLSearchParams({
			countryCode: this.lookup.region || this.provider.defaultRegion,
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
			this.updateCacheTime(timestamp);
			if (!content.metadata.total || content.metadata.total <= tracklist.length) {
				break;
			}
			offset += limit;
			query.set('offset', String(offset));
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
			labels: this.getLabels(rawRelease),
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

		// Get info about video tracks to show a warning to the user.
		const videoTrackInfo: string[] = [];

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

			if (item.artifactType === 'video') {
				videoTrackInfo.push(`${item.trackNumber}: ${item.title}`);
			}

			medium.tracklist.push(this.convertRawTrack(item));
		});

		if (videoTrackInfo.length) {
			this.addMessage(
				`This release contains ${pluralWithCount(videoTrackInfo.length, 'video track')}:\n- ${
					videoTrackInfo.join('\n- ')
				}`,
				'warning',
			);
		}

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

	private convertRawArtist(artist: SimpleArtist): ArtistCreditName {
		return {
			name: artist.name,
			creditedName: artist.name,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: artist.id.toString() }),
		};
	}

	private getLargestCoverImage(images: Image[]): Artwork[] {
		let largestImage: Image | undefined;
		let thumbnail: Image | undefined;
		images.forEach((i) => {
			if (!largestImage || i.width > largestImage.width) {
				largestImage = i;
			}
			if (i.width >= 200 && (!thumbnail || i.width < thumbnail.width)) {
				thumbnail = i;
			}
		});
		if (!largestImage) return [];
		let thumbUrl: URL | undefined;
		if (thumbnail) {
			thumbUrl = new URL(thumbnail.url);
		}
		return [{
			url: new URL(largestImage.url),
			thumbUrl: thumbUrl,
			types: ['front'],
		}];
	}

	private getLabels(rawRelease: Album): Label[] {
		// It is unsure whether providerInfo is actually used for some releases,
		// but it is documented in the API schemas.
		if (rawRelease.providerInfo?.providerName) {
			return [{
				name: rawRelease.providerInfo?.providerName,
			}];
		}

		return [];
	}
}

class TidalResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		const msg = details.errors.map((e) => `${e.field}: ${e.detail}`).join(', ');
		super('Tidal', msg, url);
	}
}
