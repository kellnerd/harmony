import { ApiAccessToken, type CacheEntry, MetadataApiProvider, type ProviderOptions } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { getFromEnv } from '@/utils/config.ts';
import { ResponseError } from '@/utils/errors.ts';
import { ResponseError as SnapResponseError } from 'snap-storage';
import { encodeBase64 } from 'std/encoding/base64.ts';
import { join } from 'std/url/join.ts';
import { availableRegions } from './regions.ts';
import { TidalV1ReleaseLookup } from './v1/lookup.ts';
import { TidalV2ReleaseLookup } from './v2/lookup.ts';

import type {
	CountryCode,
	EntityId,
	HarmonyEntityType,
	HarmonyRelease,
	LinkType,
	ReleaseOptions,
	ReleaseSpecifier,
} from '@/harmonizer/types.ts';
import type { PartialDate } from '@/utils/date.ts';
import type { ApiError as ApiErrorV1 } from './v1/api_types.ts';
import type { ApiError as ApiErrorV2 } from './v2/api_types.ts';

// See https://developer.tidal.com/reference/web-api

const tidalClientId = getFromEnv('HARMONY_TIDAL_CLIENT_ID') || '';
const tidalClientSecret = getFromEnv('HARMONY_TIDAL_CLIENT_SECRET') || '';

// The Tidal API v1 was deprecated and stopped working shortly after this timestamp.
const tidalV1MaxTimestamp = 1737454946; // 2025-01-21 10:22:26 UTC

export default class TidalProvider extends MetadataApiProvider {
	constructor(options: ProviderOptions = {}) {
		super({
			rateLimitInterval: 10000,
			concurrentRequests: 2,
			...options,
		});
	}

	readonly name = 'Tidal';

	readonly supportedUrls = new URLPattern({
		hostname: '{(www|listen).}?tidal.com',
		pathname: String.raw`{/browse}?/:type(album|artist|video)/:id(\d+)`,
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
		release: ['album', 'video'],
	};

	readonly defaultRegion: CountryCode = 'US';

	override readonly availableRegions = new Set(availableRegions);

	protected releaseLookup: typeof TidalV1ReleaseLookup | typeof TidalV2ReleaseLookup = TidalV2ReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2014,
		month: 10,
		day: 28,
	};

	override getRelease(specifier: ReleaseSpecifier, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		if (!options.snapshotMaxTimestamp || options.snapshotMaxTimestamp > tidalV1MaxTimestamp) {
			this.releaseLookup = TidalV2ReleaseLookup;
		} else {
			this.releaseLookup = TidalV1ReleaseLookup;
		}

		return super.getRelease(specifier, options);
	}

	constructUrl(entity: EntityId): URL {
		return join('https://tidal.com', entity.type, entity.id);
	}

	override serializeProviderId(entity: EntityId): string {
		if (entity.type === 'video') {
			return [entity.type, entity.id].join('/');
		} else {
			return entity.id;
		}
	}

	override parseProviderId(id: string, entityType: HarmonyEntityType): EntityId {
		if (entityType === 'release') {
			if (id.startsWith('video/')) {
				return { id: id.replace('video/', ''), type: 'video' };
			} else {
				return { id, type: 'album' };
			}
		} else {
			return { id, type: this.entityTypeMap[entityType] };
		}
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
					headers: { 'Authorization': `Bearer ${accessToken}` },
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

class TidalResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		const messages = details.errors.map((error) => {
			const errorDomain = 'meta' in error
				? error.source?.parameter ?? error.meta.category // ApiErrorV2
				: error.field ?? error.category; // ApiErrorV1
			return `${errorDomain}: ${error.detail}`;
		});
		super('Tidal', messages.join(', '), url);
	}
}

type ApiError = ApiErrorV1 | ApiErrorV2;
