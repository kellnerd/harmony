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
import { plural, pluralWithCount } from "@/utils/plural.ts";
import { isNotNull } from "@/utils/predicate.ts";
import { similarNames } from "@/utils/similarity.ts";
import { toTrackRanges } from "@/utils/tracklist.ts";
import { simplifyName } from "utils/string/simplify.js";

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
		if (artistResult) {
			return {
				type: 'artist',
				id: artistResult.hostname.groups.artist!,
			};
		}
	}
}
