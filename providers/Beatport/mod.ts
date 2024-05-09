import type { Artist, BeatportNextData, BeatportRelease, Release, Track } from './json_types.ts';
import type { ArtistCreditName, EntityId, HarmonyRelease, HarmonyTrack, LinkType } from '@/harmonizer/types.ts';
import { CacheEntry, DurationPrecision, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { extractTextFromHtml } from '@/utils/html.ts';

export default class BeatportProvider extends MetadataProvider {
	readonly name = 'Beatport';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.beatport.com',
		pathname: '/:type(artist|label|release)/:slug/:id',
	});

	readonly entityTypeMap = {
		artist: 'artist',
		label: 'label',
		release: 'release',
	};

	readonly releaseLookup = BeatportReleaseLookup;

	readonly durationPrecision = DurationPrecision.MS;

	readonly launchDate: PartialDate = {
		year: 2005,
		month: 1,
		day: 7,
	};

	readonly artworkQuality = 1400;

	readonly baseUrl = 'https://www.beatport.com';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.slug ?? '-', entity.id].join('/'), this.baseUrl);
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
				throw new ProviderError(this.provider.name, 'Search returned no matching results');
			}

			releaseId = id;
		}

		const webUrl = this.provider.constructUrl({ id: releaseId, type: 'release' });
		const { content: data, timestamp } = await this.provider.extractEmbeddedJson<BeatportNextData>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.cacheTime = timestamp;

		return this.extractRawRelease(data);
	}

	async searchReleaseByGtin(gtin: string): Promise<string | undefined> {
		const webUrl = new URL('search', this.provider.baseUrl);
		webUrl.searchParams.set('q', gtin);

		const { content: data } = await this.provider.extractEmbeddedJson<BeatportNextData>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);

		const result = data.props.pageProps.dehydratedState.queries[0];
		if (!('releases' in result.state.data)) {
			throw new ProviderError(this.provider.name, 'Failed to extract results from embedded JSON');
		}

		const release = result.state.data.releases.data.find((r) => r.upc === gtin);

		return release?.release_id.toString();
	}

	convertRawRelease(rawRelease: BeatportRelease): HarmonyRelease {
		this.id = rawRelease.id.toString();
		const releaseUrl = this.provider.constructUrl({
			id: this.id,
			type: 'release',
			slug: rawRelease.slug,
		});

		const linkTypes: LinkType[] = ['paid download'];
		// @todo paid streaming is not currently permitted for Beatport links
		// see https://tickets.metabrainz.org/browse/STYLE-2141
		// if (rawRelease.is_available_for_streaming) {
		//	linkTypes.push('paid streaming');
		//}

		return {
			title: rawRelease.name,
			artists: rawRelease.artists.map(this.makeArtistCreditName.bind(this)),
			labels: [{
				name: rawRelease.label.name,
				catalogNumber: rawRelease.catalog_number,
				externalIds: this.provider.makeExternalIds({
					type: 'label',
					id: rawRelease.label.id.toString(),
					slug: rawRelease.label.slug,
				}),
			}],
			gtin: rawRelease.upc,
			releaseDate: parseHyphenatedDate(rawRelease.new_release_date),
			media: [{
				format: 'Digital Media',
				tracklist: rawRelease.track_objects.map(this.convertRawTrack.bind(this)),
			}],
			externalLinks: [{
				url: releaseUrl,
				types: linkTypes,
			}],
			status: 'Official',
			packaging: 'None',
			images: [{
				url: new URL(rawRelease.image.uri),
				thumbUrl: new URL(rawRelease.image.dynamic_uri.replace('{w}x{h}', '250x250')),
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
