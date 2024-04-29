import type { HarmonyRelease } from '@/harmonizer/types.ts';
import { CacheEntry, DurationPrecision, type EntityId, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { ProviderError } from '@/utils/errors.ts';

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
				const json = html.match(/data-tralbum="(.+)"/)?.[1];
				if (json) {
					return new Response(json, response);
				}
				throw new ProviderError(this.name, 'Failed to extract embedded JSON');
			},
		});
	}
}

export class BandcampReleaseLookup extends ReleaseLookup<BandcampProvider, Release> {
	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	getRawRelease(): Promise<Release> {
		throw new Error('Method not implemented.');
	}

	convertRawRelease(rawRelease: Release): Promise<HarmonyRelease> {
		throw new Error('Method not implemented.');
	}
}

export type Release = {};
