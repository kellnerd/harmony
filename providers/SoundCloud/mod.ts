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
} from '@/harmonizer/types.ts';
import { type CacheEntry, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { extractDataAttribute, extractMetadataTag, extractTextFromHtml } from '@/utils/html.ts';
import { plural, pluralWithCount } from '@/utils/plural.ts';
import { isNotNull } from '@/utils/predicate.ts';
import { similarNames } from '@/utils/similarity.ts';
import { toTrackRanges } from '@/utils/tracklist.ts';
import { simplifyName } from 'utils/string/simplify.js';

export default class SoundCloudProvider extends MetadataProvider {
    readonly name = "SoundCloud";

    readonly supportedUrls = new URLPattern({
        hostname: 'soundcloud.com',
        pathname: '/:artist/set/:title',
    });

    readonly trackUrlPattern = new URLPattern({
        hostname: 'soundcloud.com',
        pathname: '/:artist/set/:title',
    });

    readonly artistUrlPattern = new URLPattern({
        hostname: 'soundcloud.com',
        pathname: '/:artist/set/:title',
    });


    override extractEntityFromUrl(url: URL): EntityId | undefined {
        
    }

}