import type { ArtistCreditName, EntityId, HarmonyRelease, HarmonyTrack, MediumFormat } from '@/harmonizer/types.ts';
import { CacheEntry, MetadataApiProvider, ProviderOptions, ReleaseApiLookup } from '@/providers/base.ts';
import { FeatureQualityMap } from '@/providers/features.ts';
import { parseHyphenatedDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { isDefined } from '@/utils/predicate.ts';
import { ArtistCredit, Release } from '@kellnerd/musicbrainz/api-types';
import { join } from 'std/url/join.ts';

export default class MusicBrainzProvider extends MetadataApiProvider {
	constructor(options: ProviderOptions = {}) {
		super({
			rateLimitInterval: 1000,
			concurrentRequests: 1,
			...options,
		});
	}

	readonly name = 'MusicBrainz';

	readonly supportedUrls = new URLPattern({
		hostname: '{(beta|test).}?musicbrainz.(org|eu)',
		pathname: '/:type(artist|release)/:id',
	});

	readonly features: FeatureQualityMap = {};

	readonly entityTypeMap = {
		artist: 'artist',
		label: 'label',
		release: 'release',
	};

	readonly releaseLookup = MusicBrainzReleaseLookup;

	readonly apiBaseUrl = 'https://musicbrainz.org/ws/2/';

	constructUrl(entity: EntityId): URL {
		return join('https://musicbrainz.org', entity.type, entity.id);
	}

	async query<Data>(apiUrl: URL, maxTimestamp?: number): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp },
			requestInit: {
				headers: {
					'Accept': 'application/json',
				},
			},
		});
		const { error } = cacheEntry.content as { error?: string };

		if (error) {
			throw new ResponseError(this.name, error, apiUrl);
		}
		return cacheEntry;
	}
}

export class MusicBrainzReleaseLookup extends ReleaseApiLookup<MusicBrainzProvider, RawRelease> {
	constructReleaseApiUrl(): URL {
		let url: URL;
		if (this.lookup.method === 'id') {
			url = join(this.provider.apiBaseUrl, 'release', this.lookup.value);
			url.searchParams.set('inc', ['artist-credits', 'labels', 'recordings', 'release-groups'].join('+'));
		} else { // if (this.lookup.method === 'gtin')
			throw new Error('Method not implemented.');
		}
		url.searchParams.set('fmt', 'json');
		return url;
	}

	async getRawRelease(): Promise<RawRelease> {
		const apiUrl = this.constructReleaseApiUrl();
		const { content: release, timestamp } = await this.provider.query<RawRelease>(
			apiUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);

		return release;
	}

	convertRawRelease(rawRelease: RawRelease): HarmonyRelease {
		this.id = rawRelease.id;

		const release: HarmonyRelease = {
			title: rawRelease.title,
			artists: rawRelease['artist-credit'].map(this.convertRawArtist),
			gtin: rawRelease.barcode || undefined, // TODO: handle empty barcode
			externalLinks: [],
			media: rawRelease.media.map((medium) => ({
				number: medium.position,
				format: medium.format as MediumFormat ?? undefined,
				title: medium.title || undefined,
				tracklist: medium.tracks?.map<HarmonyTrack>((track) => ({
					number: track.number,
					title: track.title,
					length: track.length ?? undefined,
					artists: track['artist-credit'].map(this.convertRawArtist),
					recording: { mbid: track.recording.id },
					type: track.recording.video ? 'video' : 'audio',
				})) ?? [],
			})),
			releaseDate: parseHyphenatedDate(rawRelease.date ?? ''),
			labels: rawRelease['label-info'].map((info) => ({
				name: info.label?.name,
				catalogNumber: info['catalog-number'] ?? undefined,
				mbid: info.label?.id,
			})),
			status: rawRelease.status ?? undefined,
			packaging: rawRelease.packaging ?? undefined,
			availableIn: rawRelease['release-events']
				?.flatMap((event) => event.area?.['iso-3166-1-codes']).filter(isDefined) ?? [],
			releaseGroup: { mbid: rawRelease['release-group'].id },
			info: this.generateReleaseInfo(),
		};

		const { language } = rawRelease['text-representation'];
		if (language) {
			release.language = { code: language };
		}

		return release;
	}

	private convertRawArtist(artistCredit: ArtistCredit): ArtistCreditName {
		return {
			creditedName: artistCredit.name,
			mbid: artistCredit.artist.id,
		};
	}
}

type RawRelease = Release<'artist-credits' | 'labels' | 'recordings' | 'release-groups'>;
