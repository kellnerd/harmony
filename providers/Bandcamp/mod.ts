import { DownloadPreference } from './json_types.ts';
import type { AlbumCurrent, PlayerData, PlayerTrack, ReleasePage, TrackCurrent, TrackInfo } from './json_types.ts';
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

export default class BandcampProvider extends MetadataProvider {
	readonly name = 'Bandcamp';

	readonly supportedUrls = new URLPattern({
		hostname: ':artist.bandcamp.com',
		pathname: '/:type(album|track)/:title',
	});

	readonly artistUrlPattern = new URLPattern({
		hostname: this.supportedUrls.hostname,
		pathname: '/{music}?',
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 3000,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: ['album', 'track'],
	};

	override readonly launchDate: PartialDate = {
		year: 2008,
		month: 9,
	};

	readonly releaseLookup = BandcampReleaseLookup;

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

	constructUrl(entity: EntityId): URL {
		const [artist, title] = entity.id.split('/', 2);
		const artistUrl = new URL(`https://${artist}.bandcamp.com`);

		if (entity.type === 'artist') return artistUrl;

		// else if (type === 'album' || type === 'track')
		if (!title) {
			throw new ProviderError(this.name, `Incomplete release ID '${entity.id}' does not match format \`band/title\``);
		}
		return new URL([entity.type, title].join('/'), artistUrl);
	}

	override serializeProviderId(entity: EntityId): string {
		if (entity.type === 'track') {
			return entity.id.replace('/', '/track/');
		} else {
			return entity.id;
		}
	}

	override parseProviderId(id: string, entityType: HarmonyEntityType): EntityId {
		if (entityType === 'release') {
			if (id.includes('/track/')) {
				return { id: id.replace('/track/', '/'), type: 'track' };
			} else {
				return { id, type: 'album' };
			}
		} else {
			return { id, type: this.entityTypeMap[entityType] };
		}
	}

	override getLinkTypesForEntity(): LinkType[] {
		// MB has special handling for Bandcamp artist URLs
		return ['discography page'];
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

					const licenseUrl = extractTextFromHtml(html, /class="cc-icons"\s+href="([^"]+)"/i);
					if (licenseUrl) {
						jsonEntries.push(['licenseUrl', `"${licenseUrl}"`]);
					}

					const json = `{${jsonEntries.map(([key, serializedValue]) => `"${key}":${serializedValue}`).join(',')}}`;
					return new Response(json, response);
				}
			},
		});
	}
}

export class BandcampReleaseLookup extends ReleaseLookup<BandcampProvider, ReleasePage> {
	rawReleaseUrl: URL | undefined;

	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	async getRawRelease(): Promise<ReleasePage> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		// Entity is already defined for ID/URL lookups.
		const webUrl = this.provider.constructUrl(this.entity!);
		this.rawReleaseUrl = webUrl;
		const { content: release, timestamp } = await this.provider.extractEmbeddedJson<ReleasePage>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);

		return release;
	}

	async convertRawRelease(albumPage: ReleasePage): Promise<HarmonyRelease> {
		const { tralbum: rawRelease } = albumPage;
		const { current, packages } = rawRelease;

		// Main release URL might use a custom domain, fallback to the cached `rawReleaseUrl`.
		let releaseUrl = new URL(rawRelease.url);
		if (!releaseUrl.hostname.endsWith('bandcamp.com')) {
			releaseUrl = this.rawReleaseUrl!;
		}

		if (rawRelease.item_type === 'track' && rawRelease.album_url) {
			const albumUrl = new URL(rawRelease.album_url, releaseUrl);
			this.addMessage(`Please import the full release from ${albumUrl}`, 'warning');
		}

		// The "band" can be the artist or a label.
		const bandName = albumPage.band.name;
		const bandUrl = new URL(releaseUrl);
		bandUrl.pathname = '';
		const bandId = this.provider.extractEntityFromUrl(bandUrl)!;
		const externalBandIds = this.provider.makeExternalIds(bandId);
		let bandIsLabel: boolean | undefined = undefined;

		const artist = this.makeArtistCreditName(rawRelease.artist);
		let label: Label | undefined = undefined;

		// Assume that the physical release label is also the digital label if it is unique.
		const physicalLabels = packages?.map((pkg) => pkg.label).filter(isNotNull);
		if (new Set(physicalLabels).size === 1) {
			label = { name: physicalLabels![0] };
			if (similarNames(label.name!, bandName)) {
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

		const images = [this.getArtwork(rawRelease.art_id, ['front'])];
		let tracks: Array<TrackInfo | PlayerTrack> = rawRelease.trackinfo;
		if (rawRelease.item_type === 'album' && rawRelease.album_is_preorder) {
			// Fetch embedded player JSON which already has all track durations for pre-orders.
			const embeddedPlayerRelease = await this.getEmbeddedPlayerRelease(rawRelease.id);
			tracks = embeddedPlayerRelease.tracks;
			this.addMessage('This is a pre-order release, so the metadata may change', 'warning');

			// Extract track artwork.
			const tracksWithArt = embeddedPlayerRelease.tracks.filter((track) => track.art_id);
			if (tracksWithArt.length) {
				this.addMessage(
					`Release has track artwork for ${plural(tracksWithArt.length, 'track')} ${
						toTrackRanges(tracksWithArt.map((track) => track.tracknum + 1)).join(', ')
					}`,
				);
				images.push(...tracksWithArt.map(
					(track) => this.getArtwork(track.art_id!, ['track'], `Track ${track.tracknum + 1}`),
				));
			}
		}
		const tracklist = tracks.map(this.convertRawTrack.bind(this));

		if (current.type === 'track' && current.isrc) {
			tracklist[0].isrc = current.isrc;
		}

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
		if (current.minimum_price > 0 || current.download_pref === DownloadPreference.PAID) {
			linkTypes.push('paid download');
		}
		if (rawRelease.freeDownloadPage || (current.minimum_price === 0.0 && !current.is_set_price)) {
			linkTypes.push('free download');
		}
		if (rawRelease.trackinfo.every((track) => track.streaming)) {
			linkTypes.push('free streaming');
		}

		let gtin = (current as AlbumCurrent).upc ?? undefined;
		if (packages?.length) {
			const packageInfo = packages.map(({ title, type_name, edition_size, upc }) =>
				`- **${title}**: ${type_name} (edition of ${edition_size}, GTIN: ${upc})`
			);
			packageInfo.unshift('Available physical release packages:');
			this.addMessage(packageInfo.join('\n'));

			if (gtin && packages.some((physicalRelease) => gtin === physicalRelease.upc)) {
				this.addMessage(
					`GTIN ${gtin} was not used for the digital release as it belongs to one of the physical release packages`,
					'warning',
				);
				gtin = undefined;
			}
		}

		const release: HarmonyRelease = {
			title: current.title,
			artists: [artist],
			labels: label ? [label] : undefined,
			gtin: gtin,
			releaseDate: this.getReleaseDate(current),
			availableIn: ['XW'],
			media: [{
				format: 'Digital Media',
				tracklist,
			}],
			status: 'Official',
			packaging: 'None',
			types: current.type == 'track' ? ['Single'] : undefined,
			externalLinks: [{
				url: releaseUrl.href,
				types: linkTypes,
			}],
			images: images,
			credits: current.credits?.replaceAll('\r', ''),
			info: this.generateReleaseInfo(),
		};

		if (albumPage.licenseUrl) {
			release.externalLinks.push({
				url: albumPage.licenseUrl,
				types: ['license'],
			});
		}

		return release;
	}

	convertRawTrack(rawTrack: TrackInfo | PlayerTrack, index: number): HarmonyTrack {
		const { artist, title_link } = rawTrack;
		let { title } = rawTrack;
		let trackNumber: number;

		if ('track_num' in rawTrack) {
			trackNumber = rawTrack.track_num ?? index + 1;
			if (artist) {
				// Track title is prefixed by the track artist (if filled).
				title = title.replace(`${artist} - `, '');
			}
		} else {
			trackNumber = rawTrack.tracknum + 1;
		}

		return {
			number: trackNumber,
			title,
			artists: artist ? [this.makeArtistCreditName(artist)] : undefined,
			length: rawTrack.duration * 1000,
			recording: {
				externalIds: title_link ? this.provider.makeExternalIdsFromUrl(title_link, this.rawReleaseUrl) : [],
			},
		};
	}

	makeArtistCreditName(artist: string): ArtistCreditName {
		return {
			name: artist,
			creditedName: artist,
		};
	}

	getArtwork(artworkId: number, types?: ArtworkType[], comment?: string): Artwork {
		const baseUrl = 'https://f4.bcbits.com/img/';
		return {
			url: new URL(`a${artworkId}_0.jpg`, baseUrl).href,
			thumbUrl: new URL(`a${artworkId}_9.jpg`, baseUrl).href, // 210x210
			types,
			comment,
		};
	}

	getReleaseDate(current: AlbumCurrent | TrackCurrent): PartialDate | undefined {
		let date = current.release_date ? parseISODateTime(current.release_date) : undefined;

		// Use publish date if release date is before Bandcamp launch (2008-09)
		const launchDate = this.provider.launchDate;
		if (
			!date?.year || date.year < launchDate.year! || (date.year === launchDate.year && date.month! < launchDate.month!)
		) {
			date = current.publish_date ? parseISODateTime(current.publish_date) : undefined;
		}

		return date;
	}

	async getEmbeddedPlayerRelease(albumId: number): Promise<PlayerData> {
		const { content: release, timestamp } = await this.provider.extractEmbeddedJson<PlayerData>(
			new URL(`https://bandcamp.com/EmbeddedPlayer/album=${albumId}`),
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);

		return release;
	}
}
