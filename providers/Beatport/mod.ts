import type { Artist, BeatportNextData, BeatportRelease, Release, Track } from './json_types.ts';
import type { ArtistCreditName, EntityId, HarmonyRelease, HarmonyTrack, LinkType } from '@/harmonizer/types.ts';
import { variousArtists } from '@/musicbrainz/special_entities.ts';
import { CacheEntry, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { extractTextFromHtml } from '@/utils/html.ts';

export default class BeatportProvider extends MetadataProvider {
	readonly name = 'Beatport';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.beatport.com',
		pathname: '/:language(\\w{2})?/:type(artist|label|release)/:slug/:id',
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 1400,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.EXPENSIVE,
		'MBID resolving': FeatureQuality.PRESENT,
		'release label': FeatureQuality.GOOD,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		label: 'label',
		release: 'release',
	};

	readonly releaseLookup = BeatportReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2005,
		month: 1,
		day: 7,
	};

	readonly baseUrl = 'https://www.beatport.com';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.slug ?? '-', entity.id].join('/'), this.baseUrl);
	}

	override getLinkTypesForEntity(): LinkType[] {
		/** See comment at {@linkcode BeatportReleaseLookup.convertRawRelease}. */
		return ['paid download'];
	}

	extractEmbeddedJson<Data>(webUrl: URL, maxTimestamp?: number): Promise<CacheEntry<Data>> {
		return this.fetchJSON<Data>(webUrl, {
			policy: { maxTimestamp },
			responseMutator: async (response) => {
				const html = await response.text();
				const nextData = extractTextFromHtml(
					html,
					/<script(?=[^>]+?id=["']__NEXT_DATA__["'])(?=[^>]+?type=["']application\/json["'])[^>]+?>(.+?)<\/script>/i,
				);
				if (nextData) {
					return new Response(nextData, response);
				}

				throw new ResponseError(this.name, 'Failed to extract embedded JSON', webUrl);
			},
		});
	}
}

export class BeatportReleaseLookup extends ReleaseLookup<BeatportProvider, Release> {
	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	async getRawRelease(): Promise<BeatportRelease> {
		let releaseId = this.lookup.value;

		if (this.lookup.method === 'gtin') {
			const id = await this.searchReleaseByGtin(this.lookup.value);
			if (!id) {
				throw new ProviderError(this.provider.name, `Search returned no matching results for '${this.lookup.value}'`);
			}

			releaseId = id;
		}

		const webUrl = this.provider.constructUrl({ id: releaseId, type: 'release' });
		const { content: data, timestamp } = await this.provider.extractEmbeddedJson<BeatportNextData>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);

		return this.extractRawRelease(data);
	}

	async searchReleaseByGtin(gtin: string): Promise<string | undefined> {
		const webUrl = new URL('search', this.provider.baseUrl);
		webUrl.searchParams.set('q', gtin);

		const { content: data, timestamp } = await this.provider.extractEmbeddedJson<BeatportNextData>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);

		const result = data.props.pageProps.dehydratedState.queries[0];
		if (!('releases' in result.state.data)) {
			throw new ProviderError(this.provider.name, 'Failed to extract results from embedded JSON');
		}

		const release = result.state.data.releases.data.find((r) => r.upc === gtin);

		return release?.release_id.toString();
	}

	convertRawRelease(rawRelease: BeatportRelease): HarmonyRelease {
		this.entity = {
			id: rawRelease.id.toString(),
			slug: rawRelease.slug,
			type: 'release',
		};
		const releaseUrl = this.provider.constructUrl(this.entity);

		const linkTypes: LinkType[] = ['paid download'];
		if (rawRelease.is_available_for_streaming) {
			linkTypes.push('paid streaming');
		}

		return {
			title: rawRelease.name,
			// Beatport accumulates all track artists as release artist, even if it should be VA instead.
			// @todo Properly differentiate between VA and releases with main and many featured artists.
			artists: rawRelease.artists.length > 4
				? [variousArtists]
				: rawRelease.artists.map(this.makeArtistCreditName.bind(this)),
			labels: [{
				name: rawRelease.label.name,
				catalogNumber: rawRelease.catalog_number,
				externalIds: this.provider.makeExternalIds({
					type: 'label',
					id: rawRelease.label.id.toString(),
					slug: rawRelease.label.slug,
				}),
			}],
			gtin: rawRelease.upc ?? undefined,
			releaseDate: parseHyphenatedDate(rawRelease.new_release_date),
			media: [{
				format: 'Digital Media',
				tracklist: rawRelease.track_objects.map(this.convertRawTrack.bind(this)),
			}],
			externalLinks: [{
				url: releaseUrl.href,
				types: linkTypes,
			}],
			status: 'Official',
			packaging: 'None',
			images: [{
				url: rawRelease.image.uri,
				thumbUrl: rawRelease.image.dynamic_uri.replace('{w}x{h}', '250x250'),
				types: ['front'],
			}],
			info: this.generateReleaseInfo(),
		};
	}

	convertRawTrack(rawTrack: Track, index: number): HarmonyTrack {
		let title = rawTrack.name;
		if (rawTrack.mix_name !== 'Original Mix') {
			title += ` (${rawTrack.mix_name})`;
		}

		return {
			number: index + 1,
			title: title,
			artists: rawTrack.artists.map(this.makeArtistCreditName.bind(this)),
			length: rawTrack.length_ms,
			isrc: rawTrack.isrc,
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'track', id: rawTrack.id.toString(), slug: rawTrack.slug }),
			},
		};
	}

	makeArtistCreditName(artist: Artist): ArtistCreditName {
		return {
			name: artist.name,
			creditedName: artist.name,
			externalIds: this.provider.makeExternalIds({
				type: 'artist',
				id: artist.id.toString(),
				slug: artist.slug,
			}),
		};
	}

	extractRawRelease(nextData: BeatportNextData): BeatportRelease {
		const release = nextData.props.pageProps.release;
		if (!release) {
			throw new ProviderError(this.provider.name, 'Failed to extract release from embedded JSON');
		} else if (release.track_count > 100) {
			throw new ProviderError(this.provider.name, 'Releases with more than 100 tracks are not currently supported');
		}

		const tracksResult = nextData.props.pageProps.dehydratedState.queries[1];
		if (!tracksResult || !('results' in tracksResult.state.data)) {
			throw new ProviderError(this.provider.name, 'Failed to extract tracks from embedded JSON');
		}
		const tracks = tracksResult.state.data.results;

		// tracks are listed in reverse order
		const releaseTracks = release.tracks.slice().reverse().map((url) => {
			const track = tracks.find((t) => url === t.url);
			if (!track) {
				throw new ProviderError(this.provider.name, `Track ${url} not found in embedded JSON`);
			}

			return track;
		});

		return { ...release, track_objects: releaseTracks };
	}
}
