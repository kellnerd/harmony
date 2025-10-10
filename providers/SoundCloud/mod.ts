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

const soundcloudClientId = getFromEnv('HARMONY_SOUNDCLOUD_CLIENT_ID') || '';
const soundcloudClientSecret = getFromEnv('HARMONY_SOUNDCLOUD_CLIENT_SECRET') || '';


export default class SoundCloudProvider extends MetadataProvider {
	readonly name = "SoundCloud";

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

	//Soundcloud's client credentials authentication works surprisingly simularly to Spotify's https://developers.soundcloud.com/docs#authentication
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
		const albumResult = this.supportedUrls.exec(url);
		if (albumResult) {
			const artist = albumResult.hostname.groups.artist!;
			const { type, title } = albumResult.pathname.groups;
			if (type && title) {
				return {
					type,
					id: [artist, title].join('/'),
				};
			}
		}

		const artistResult = this.artistUrlPattern.exec(url);
	}
}
