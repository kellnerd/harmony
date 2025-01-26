import { availableRegions } from './regions.ts';
import { ApiAccessToken, type CacheEntry, MetadataApiProvider, type ProviderOptions } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { ResponseError as SnapResponseError } from 'snap-storage';
import { encodeBase64 } from 'std/encoding/base64.ts';
import { join } from 'std/url/join.ts';

import type { ApiError } from './v1/api_types.ts';
import { TidalV1ReleaseLookup } from '@/providers/Tidal/v1/lookup.ts';
import type { CountryCode, EntityId, LinkType } from '@/harmonizer/types.ts';

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

	readonly releaseLookup = TidalV1ReleaseLookup;

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

class TidalResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		const msg = details.errors.map((e) => `${e.field ?? e.category}: ${e.detail}`).join(', ');
		super('Tidal', msg, url);
	}
}
