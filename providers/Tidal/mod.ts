import { availableRegions } from './regions.ts';
import {
	ApiAccessToken,
	type CacheEntry,
	MetadataApiProvider,
	type ProviderOptions,
	ReleaseApiLookup,
} from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { capitalizeReleaseType } from '@/harmonizer/release_types.ts';
import { formatCopyrightSymbols } from '@/utils/copyright.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { selectLargestImage } from '@/utils/image.ts';
import { ResponseError as SnapResponseError } from 'snap-storage';
import { encodeBase64 } from 'std/encoding/base64.ts';
import { join } from 'std/url/join.ts';

import type { Album, AlbumItem, ApiError, Resource, Result, SimpleArtist } from './api_types.ts';
import type {
	ArtistCreditName,
	CountryCode,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	LinkType,
} from '@/harmonizer/types.ts';

// See https://developer.tidal.com/reference/web-api

const tidalClientId = Deno.env.get('HARMONY_TIDAL_CLIENT_ID') || '';
const tidalClientSecret = Deno.env.get('HARMONY_TIDAL_CLIENT_SECRET') || '';

export default class TidalProvider extends MetadataApiProvider {
	constructor(options: ProviderOptions = {}) {
		super({
			rateLimitInterval: 1000,
			concurrentRequests: 2,
			...options,
		});
	}

	readonly name = 'Tidal';

	readonly supportedUrls = new URLPattern({
		hostname: '{(www|listen).}?tidal.com',
		pathname: String.raw`{/browse}?/:type(album|artist)/:id(\d+)`,
	});

	override readonly features: FeatureQualityMap = {
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

	override readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = TidalReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2014,
		month: 10,
		day: 28,
	};

	readonly apiBaseUrl = 'https://openapi.tidal.com';

	constructUrl(entity: EntityId): URL {
		return join('https://tidal.com', entity.type, entity.id);
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['paid streaming'];
	}

	async query<Data>(apiUrl: URL, maxTimestamp?: number): Promise<CacheEntry<Data>> {
		try {
			const accessToken = await this.cachedAccessToken(this.requestAccessToken);
			const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
				policy: { maxTimestamp },
				requestInit: {
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-Type': 'application/vnd.tidal.v1+json',
					},
				},
			});
			const apiError = cacheEntry.content as ApiError;

			if (apiError?.errors) {
				throw new TidalResponseError(apiError, apiUrl);
			}
			return cacheEntry;
		} catch (error) {
			let apiError: ApiError | undefined;
			if (error instanceof SnapResponseError) {
				try {
					// Clone the response so the body of the original response can be
					// consumed later if the error gets re-thrown.
					apiError = await error.response.clone().json();
				} catch {
					// Ignore secondary JSON parsing error, rethrow original error.
				}
			}
			if (apiError?.errors) {
				throw new TidalResponseError(apiError, apiUrl);
			} else {
				throw error;
			}
		}
	}

	private async requestAccessToken(): Promise<ApiAccessToken> {
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
			validUntilTimestamp: Date.now() + (content.expires_in * 1000),
		};
	}
}

export class TidalReleaseLookup extends ReleaseApiLookup<TidalProvider, Album> {
	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		let lookupUrl: URL;
		const query = new URLSearchParams({
			countryCode: region || this.provider.defaultRegion,
		});
		if (method === 'gtin') {
			lookupUrl = join(this.provider.apiBaseUrl, `albums/byBarcodeId`);
			query.append('barcodeId', value);
		} else { // if (method === 'id')
			lookupUrl = join(this.provider.apiBaseUrl, 'albums', value);
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(): Promise<Album> {
		if (!this.options.regions?.size) {
			this.options.regions = new Set([this.provider.defaultRegion]);
		}
		if (this.lookup.method === 'gtin') {
			const isValidData = (data: Result<Album>) => {
				return Boolean(data?.data?.length);
			};
			const result = await this.queryAllRegions<Result<Album>>(isValidData);
			if (result.data.length > 1) {
				this.warnMultipleResults(result.data.slice(1).map((release) => release.resource.tidalUrl));
			}
			return result.data[0].resource;
		} else {
			const isValidData = (data: Resource<Album>) => {
				return Boolean(data?.resource);
			};
			// If this was a 404 not found error, ignore it and try next region.
			const isCriticalError = (error: unknown) => {
				const { response } = error as { response?: Response };
				return response?.status !== 404;
			};
			const result = await this.queryAllRegions<Resource<Album>>(isValidData, isCriticalError);
			return result.resource;
		}
	}

	private async getRawTracklist(albumId: string): Promise<AlbumItem[]> {
		const tracklist: AlbumItem[] = [];
		const url = join(this.provider.apiBaseUrl, 'albums', albumId, 'items');
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
		const artwork = selectLargestImage(rawRelease.imageCover, ['front']);
		return {
			title: rawRelease.title,
			artists: rawRelease.artists.map(this.convertRawArtist.bind(this)),
			gtin: rawRelease.barcodeId,
			externalLinks: [{
				url: new URL(rawRelease.tidalUrl),
				types: this.provider.getLinkTypesForEntity(),
			}],
			media,
			releaseDate: parseHyphenatedDate(rawRelease.releaseDate),
			copyright: rawRelease.copyright ? formatCopyrightSymbols(rawRelease.copyright) : undefined,
			status: 'Official',
			types: [capitalizeReleaseType(rawRelease.type)],
			packaging: 'None',
			images: artwork ? [artwork] : [],
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
			type: track.artifactType === 'video' ? 'video' : 'audio',
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
		const msg = details.errors.map((e) => `${e.field ?? e.category}: ${e.detail}`).join(', ');
		super('Tidal', msg, url);
	}
}
