import type {
	ArtistCreditName,
	Artwork,
	ArtworkType,
	EntityId,
	HarmonyEntityType,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	LinkType,
} from "@/harmonizer/types.ts";
import {
	type ApiAccessToken,
	type ApiQueryOptions,
	type CacheEntry,
	MetadataApiProvider,
	MetadataProvider,
	ReleaseLookup,
} from "@/providers/base.ts";
import {
	DurationPrecision,
	FeatureQuality,
	FeatureQualityMap,
} from "@/providers/features.ts";
import { parseISODateTime, PartialDate } from "@/utils/date.ts";
import { ProviderError, ResponseError } from "@/utils/errors.ts";
import {
	extractDataAttribute,
	extractMetadataTag,
	extractTextFromHtml,
} from "@/utils/html.ts";
import { getFromEnv } from '@/utils/config.ts';
import { plural, pluralWithCount } from "@/utils/plural.ts";
import { isNotNull } from "@/utils/predicate.ts";
import { similarNames } from "@/utils/similarity.ts";
import { toTrackRanges } from "@/utils/tracklist.ts";
import { simplifyName } from "utils/string/simplify.js";
import type {
	ApiError,
	SoundcloudPlaylist,
	SoundcloudUser,
	SoundCloudTrack,
	SoundcloudSearch,
	SoundcloudFilter,
} from './api_types.ts';
import { encodeBase64 } from 'std/encoding/base64.ts';
import { ResponseError as SnapResponseError } from 'snap-storage';



const soundcloudClientId = getFromEnv('HARMONY_SOUNDCLOUD_CLIENT_ID') || '';
const soundcloudClientSecret = getFromEnv('HARMONY_SOUNDCLOUD_CLIENT_SECRET') || '';


export default class SoundCloudProvider extends MetadataApiProvider {
	readonly name = "SoundCloud";

	readonly apiBaseUrl = new URL('https://api.soundcloud.com/');

	readonly supportedUrls = new URLPattern({
		hostname: "soundcloud.com",
		pathname: "/:artist/set/:title",
	});

	readonly trackUrlPattern = new URLPattern({
		hostname: "soundcloud.com",
		pathname: "/:artist/:title",
	});

	readonly artistUrlPattern = new URLPattern({
		hostname: "soundcloud.com",
		pathname: "/:artist",
	});

	override readonly launchDate: PartialDate = {
		year: 2008,
		month: 10,
		day: 17,
	};

	override readonly features: FeatureQualityMap = {
		'cover size': 500,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: 'user',
		release: ['playlist', 'album'],
	};

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
			try {
				await this.requestDelay;
				const accessToken = await this.cachedAccessToken(this.requestAccessToken);
				const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
					policy: { maxTimestamp: options.snapshotMaxTimestamp },
					requestInit: {
						headers: {
							'Authorization': `Bearer ${accessToken}`,
						},
					},
				});
				const apiError = cacheEntry.content as ApiError;
				if (apiError.error) {
					throw new SoundCloudResponseError(apiError, apiUrl);
				}
				return cacheEntry;
			} catch (error) {
				let apiError: ApiError | undefined;
				if (error instanceof SnapResponseError) {
					const { response } = error;
					this.handleRateLimit(response);
					// Retry API query when we encounter a 429 rate limit error.
					if (response.status === 429) {
						return this.query(apiUrl, options);
					}
					try {
						// Clone the response so the body of the original response can be
						// consumed later if the error gets re-thrown.
						apiError = await response.clone().json();
					} catch {
						// Ignore secondary JSON parsing error, rethrow original error.
					}
				}
				if (apiError?.error) {
					throw new SoundCloudResponseError(apiError, apiUrl);
				} else {
					throw error;
				}
			}
		}

	//Soundcloud's client credentials authentication works surprisingly similarly to Spotify's https://developers.soundcloud.com/docs#authentication
	private async requestAccessToken(): Promise<ApiAccessToken> {
		// See https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
		const url = new URL('https://secure.soundcloud.com/oauth/token');
		const auth = encodeBase64(`${soundcloudClientId}:${soundcloudClientSecret}`);
		const body = new URLSearchParams();
		body.append('grant_type', 'client_credentials');

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

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const playlistResult = this.supportedUrls.exec(url);
		const trackResult = this.trackUrlPattern.exec(url);
		const artistResult = this.artistUrlPattern.exec(url);
		const query = new URLSearchParams();
		query.set('url', url.href);
		const resolveUrl = new URL('resolve', this.apiBaseUrl);
		resolveUrl.search = query.toString();
		if (playlistResult | trackResult | artistResult) {
			const cacheEntry = this.query<SoundcloudPlaylist | SoundcloudUser | SoundcloudTrack>(resolveUrl, { resolveUrl: this.options.snapshotMaxTimestamp });
			this.updateCacheTime(cacheEntry.timestamp);
			const entity = cacheEntry.content
			if (entity) {
				return entity.urn;
			}
		}
	}
}

class SoundCloudResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		super('SoundCloud', details?.status, url); //While there exists a message field in the error response, it's usually empty, despite status being deprecated.
	}
}

export class SoundCloudReleaseLookup extends ReleaseLookup<SoundCloudProvider> {

}
