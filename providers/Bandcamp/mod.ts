import type { TrackInfo, TrAlbum } from './json_types.ts';
import type { Artwork, ArtworkType, HarmonyRelease, HarmonyTrack, LinkType } from '@/harmonizer/types.ts';
import { CacheEntry, DurationPrecision, type EntityId, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { parseISODateTime } from '@/utils/date.ts';
import { ProviderError } from '@/utils/errors.ts';
import { unescape } from 'std/html/mod.ts';

export default class BandcampProvider extends MetadataProvider {
	readonly name = 'Bandcamp';

	readonly supportedUrls = new URLPattern({
		hostname: ':artist.bandcamp.com',
		pathname: '/:type(album)/:album',
	});

	readonly artistUrlPattern = new URLPattern({
		hostname: this.supportedUrls.hostname,
		pathname: '/{music}?',
	});

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
	};

	readonly releaseLookup = BandcampReleaseLookup;

	readonly durationPrecision = DurationPrecision.MS;

	readonly artworkQuality = 3000;

	extractEntityFromUrl(url: URL): EntityId | undefined {
		const albumResult = this.supportedUrls.exec(url);
		if (albumResult) {
			const artist = albumResult.hostname.groups.artist!;
			const { type, album } = albumResult.pathname.groups;
			if (type && album) {
				return {
					type,
					id: [artist, album].join('/'),
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

	constructUrl(entity: EntityId): URL {
		const [artist, album] = entity.id.split('/', 2);
		const artistUrl = new URL(`https://${artist}.bandcamp.com`);

		if (entity.type === 'artist') return artistUrl;

		// else if (entity.type === 'album')
		return new URL(['album', album].join('/'), artistUrl);
	}

	extractEmbeddedJson<Data>(webUrl: URL, maxTimestamp?: number): Promise<CacheEntry<Data>> {
		return this.fetchJSON<Data>(webUrl, {
			policy: { maxTimestamp },
			responseMutator: async (response) => {
				const html = await response.text();
				const json = html.match(/data-tralbum="(.+?)"/)?.[1];
				if (json) {
					return new Response(unescape(json), response);
				}
				throw new ProviderError(this.name, 'Failed to extract embedded JSON');
			},
		});
	}
}

export class BandcampReleaseLookup extends ReleaseLookup<BandcampProvider, TrAlbum> {
	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	async getRawRelease(): Promise<TrAlbum> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		const webUrl = this.constructReleaseUrl(this.lookup.value);
		const { content: release, timestamp } = await this.provider.extractEmbeddedJson<TrAlbum>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.cacheTime = timestamp;

		return release;
	}

	convertRawRelease(rawRelease: TrAlbum): HarmonyRelease {
		const releaseUrl = new URL(rawRelease.url);
		this.id = this.provider.extractEntityFromUrl(releaseUrl)!.id;

		const linkTypes: LinkType[] = [];
		if (rawRelease.current.minimum_price > 0) {
			linkTypes.push('paid download');
		} else {
			linkTypes.push('free download');
		}
		if (rawRelease.trackinfo.every((track) => track.streaming)) {
			linkTypes.push('free streaming');
		}

		const release: HarmonyRelease = {
			title: rawRelease.current.title,
			artists: [{
				name: rawRelease.artist,
				externalLink: this.provider.constructUrl({ type: 'artist', id: this.id }),
			}],
			gtin: rawRelease.current.upc,
			releaseDate: parseISODateTime(rawRelease.current.release_date),
			media: [{
				format: 'Digital Media',
				tracklist: rawRelease.trackinfo.map(this.convertRawTrack.bind(this)),
			}],
			status: 'Official',
			packaging: 'None',
			externalLinks: [{
				url: releaseUrl,
				types: linkTypes,
			}],
			images: [this.getArtwork(rawRelease.art_id, ['front'])],
			info: this.generateReleaseInfo(),
		};

		return release;
	}

	convertRawTrack(rawTrack: TrackInfo): HarmonyTrack {
		return {
			number: rawTrack.track_num,
			title: rawTrack.title,
			duration: rawTrack.duration * 1000,
		};
	}

	getArtwork(artworkId: number, types?: ArtworkType[]): Artwork {
		const baseUrl = 'https://f4.bcbits.com/img/';
		return {
			url: new URL(`a${artworkId}_0.jpg`, baseUrl),
			thumbUrl: new URL(`a${artworkId}_9.jpg`, baseUrl), // 210x210
			types,
		};
	}
}
