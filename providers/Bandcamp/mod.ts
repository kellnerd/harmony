import type { AlbumPage, PlayerData, PlayerTrack, TrackInfo } from './json_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	ArtworkType,
	EntityId,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	LinkType,
} from '@/harmonizer/types.ts';
import { type CacheEntry, DurationPrecision, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { parseISODateTime } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { extractDataAttribute, extractMetadataTag } from '@/utils/html.ts';
import { pluralWithCount } from '@/utils/plural.ts';
import { isNotNull } from '@/utils/predicate.ts';
import { similarNames } from '@/utils/similarity.ts';
import { simplifyName } from 'utils/string/simplify.js';

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
				const isEmbeddedPlayer = webUrl.pathname.startsWith('/EmbeddedPlayer');
				const html = await response.text();

				if (isEmbeddedPlayer) {
					const playerData = extractDataAttribute(html, 'player-data');
					if (playerData) {
						return new Response(playerData, response);
					} else {
						throw new ResponseError(this.name, `Failed to extract embedded player JSON`, webUrl);
					}
				} else {
					const dataAttributeKeys = ['tralbum', 'band'];
					const jsonEntries: [string, string][] = dataAttributeKeys.map((key) => {
						const serializedValue = extractDataAttribute(html, key);
						if (serializedValue) {
							return [key, serializedValue];
						} else {
							throw new ResponseError(this.name, `Failed to extract embedded '${key}' JSON`, webUrl);
						}
					});

					const description = extractMetadataTag(html, 'og:description');
					if (description) {
						jsonEntries.push(['og:description', `"${description}"`]);
					}

					const json = `{${jsonEntries.map(([key, serializedValue]) => `"${key}":${serializedValue}`).join(',')}}`;
					return new Response(json, response);
				}
			},
		});
	}
}

export class BandcampReleaseLookup extends ReleaseLookup<BandcampProvider, AlbumPage> {
	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	async getRawRelease(): Promise<AlbumPage> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		const webUrl = this.constructReleaseUrl(this.lookup.value);
		const { content: release, timestamp } = await this.provider.extractEmbeddedJson<AlbumPage>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.cacheTime = timestamp;

		return release;
	}

	async convertRawRelease(albumPage: AlbumPage): Promise<HarmonyRelease> {
		const { tralbum: rawRelease } = albumPage;
		const releaseUrl = new URL(rawRelease.url);
		this.id = this.provider.extractEntityFromUrl(releaseUrl)!.id;

		// The "band" can be the artist or a label.
		const bandName = albumPage.band.name;
		const bandUrl = new URL(rawRelease.url);
		bandUrl.pathname = '';
		const bandId = this.provider.extractEntityFromUrl(bandUrl)!;
		const externalBandIds = this.provider.makeExternalIds(bandId);
		let bandIsLabel: boolean | undefined = undefined;

		const artist = this.makeArtistCreditName(rawRelease.artist);
		let label: Label | undefined = undefined;

		// Assume that the physical release label is also the digital label if it is unique.
		const physicalLabels = rawRelease.packages?.map((pkg) => pkg.label).filter(isNotNull);
		if (new Set(physicalLabels).size === 1) {
			label = { name: physicalLabels![0] };
			if (similarNames(label.name, bandName)) {
				bandIsLabel = true;
				label.externalIds = externalBandIds;
			}
		}

		if (bandIsLabel !== true) {
			// Treat band as artist if the names are similar, otherwise as label.
			if (similarNames(artist.name, bandName)) {
				bandIsLabel = false;
				artist.externalIds = externalBandIds;
			} else if (simplifyName(artist.name).includes(simplifyName(bandName))) {
				// If the artist credit includes the band name it is not a label.
				// TODO: Split multiple artists, then we can assign the band ID to one of them.
				bandIsLabel = false;
			} else {
				label = {
					name: bandName,
					externalIds: externalBandIds,
				};
			}
		}

		let tracks: Array<TrackInfo | PlayerTrack> = rawRelease.trackinfo;
		if (rawRelease.is_preorder) {
			// Fetch embedded player JSON which already has all track durations for pre-orders.
			const embeddedPlayerRelease = await this.getEmbeddedPlayerRelease(rawRelease.id);
			tracks = embeddedPlayerRelease.tracks;
			this.addMessage('This is a pre-order release, so the metadata may change', 'warning');
		}
		const tracklist = tracks.map(this.convertRawTrack.bind(this));

		const realTrackCount = albumPage['og:description']?.match(/(\d+) track/i)?.[1];
		if (realTrackCount) {
			const hiddenTrackCount = parseInt(realTrackCount) - tracks.length;
			if (hiddenTrackCount) {
				tracklist.push(...new Array<HarmonyTrack>(hiddenTrackCount).fill({ title: '[unknown]' }));
				this.addMessage(
					`${pluralWithCount(hiddenTrackCount, 'track is', 'tracks are')} hidden and only available with the download`,
					'warning',
				);
			}
		}

		const linkTypes: LinkType[] = [];
		if (rawRelease.current.minimum_price > 0) {
			linkTypes.push('paid download');
		} else {
			linkTypes.push('free download');
		}
		if (rawRelease.trackinfo.every((track) => track.streaming)) {
			linkTypes.push('free streaming');
		}

		if (rawRelease.packages?.length) {
			const packageInfo = rawRelease.packages.map(({ title, type_name, edition_size, upc }) =>
				`- **${title}**: ${type_name} (edition of ${edition_size}, GTIN: ${upc})`
			);
			packageInfo.unshift('Available physical release packages:');
			this.addMessage(packageInfo.join('\n'));
		}

		const release: HarmonyRelease = {
			title: rawRelease.current.title,
			artists: [artist],
			labels: label ? [label] : undefined,
			gtin: rawRelease.current.upc ?? undefined,
			releaseDate: parseISODateTime(rawRelease.current.release_date),
			availableIn: ['XW'],
			media: [{
				format: 'Digital Media',
				tracklist,
			}],
			status: 'Official',
			packaging: 'None',
			externalLinks: [{
				url: releaseUrl,
				types: linkTypes,
			}],
			images: [this.getArtwork(rawRelease.art_id, ['front'])],
			credits: rawRelease.current.credits?.replaceAll('\r', ''),
			info: this.generateReleaseInfo(),
		};

		return release;
	}

	convertRawTrack(rawTrack: TrackInfo | PlayerTrack): HarmonyTrack {
		return {
			number: 'track_num' in rawTrack ? rawTrack.track_num : rawTrack.tracknum + 1,
			title: rawTrack.title,
			artists: rawTrack.artist ? [this.makeArtistCreditName(rawTrack.artist)] : undefined,
			length: rawTrack.duration * 1000,
		};
	}

	makeArtistCreditName(artist: string): ArtistCreditName {
		return {
			name: artist,
			creditedName: artist,
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

	async getEmbeddedPlayerRelease(albumId: number): Promise<PlayerData> {
		const { content: release, timestamp } = await this.provider.extractEmbeddedJson<PlayerData>(
			new URL(`https://bandcamp.com/EmbeddedPlayer/album=${albumId}`),
			this.options.snapshotMaxTimestamp,
		);
		this.cacheTime = timestamp;

		return release;
	}
}
