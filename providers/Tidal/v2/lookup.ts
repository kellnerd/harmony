import { getLogger } from 'std/log/get_logger.ts';
import { join } from 'std/url/join.ts';
import { ReleaseApiLookup } from '@/providers/base.ts';
import type TidalProvider from '@/providers/Tidal/mod.ts';
import { formatCopyrightSymbols } from '@/utils/copyright.ts';
import { capitalizeReleaseType } from '@/harmonizer/release_types.ts';
import { selectLargestImage } from '@/utils/image.ts';
import { CacheMissError, ProviderError } from '@/utils/errors.ts';
import { parseHyphenatedDate } from '@/utils/date.ts';
import { parseISODuration } from '@/utils/time.ts';

import type {
	AlbumItemResourceIdentifier,
	AlbumsResource,
	ArtistsResource,
	ArtworksResource,
	MultiDataDocument,
	ProvidersResource,
	SingleDataDocument,
	TracksResource,
	VideosResource,
} from './api_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';

type ReleaseResource = AlbumsResource | VideosResource;

/** Supported compatibility modes of release lookups. */
enum LookupCompatibility {
	/** Original URL format for the Tidal v2 API. */
	Original,
	/** 2025-06-17: New include parameter for cover art is required. */
	IncludeCoverArt,
}

export class TidalV2ReleaseLookup extends ReleaseApiLookup<TidalProvider, SingleDataDocument<ReleaseResource>> {
	readonly apiBaseUrl = 'https://openapi.tidal.com/v2/';

	private compatibility = LookupCompatibility.Original;

	constructReleaseApiUrl(): URL {
		let { method, value, region } = this.lookup;
		let resource = 'albums';
		if (method === 'id' && value.startsWith('video/')) {
			resource = 'videos';
			value = value.replace('video/', '');
		}
		const lookupUrl = join(this.apiBaseUrl, resource);
		const includes = ['artists', 'items.artists', 'providers'];
		if (this.compatibility === LookupCompatibility.IncludeCoverArt) {
			includes.push(resource === 'videos' ? 'thumbnailArt' : 'coverArt');
		}
		const query = new URLSearchParams({
			countryCode: region || this.provider.defaultRegion,
			include: includes.join(','),
		});
		if (method === 'gtin') {
			query.append('filter[barcodeId]', value);
		} else { // if (method === 'id')
			query.append('filter[id]', value);
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(): Promise<SingleDataDocument<ReleaseResource>> {
		if (!this.options.regions?.size) {
			this.options.regions = new Set([this.provider.defaultRegion]);
		}

		const isValidData = (data: MultiDataDocument<ReleaseResource>): boolean => Boolean(data?.data?.length);
		let result: MultiDataDocument<ReleaseResource> | undefined = undefined;
		if (this.options.snapshotMaxTimestamp) {
			// Check for cached snapshots using the original URL format first.
			try {
				this.compatibility = LookupCompatibility.Original;
				result = await this.queryAllRegions({ isValidData, offline: true });
			} catch (error) {
				// Ignore cache misses, there are more compatibility modes to be tried.
				if (!(error instanceof CacheMissError)) throw error;
			}
		}
		if (!result) {
			// Regular query using the latest compatibility mode.
			this.compatibility = LookupCompatibility.IncludeCoverArt;
			result = await this.queryAllRegions({ isValidData, offline: false });
		}

		if (result.data.length > 1) {
			this.warnMultipleResults(
				result.data.slice(1).map((release) => this.constructReleaseUrlFromRelease(release)),
			);
		}

		return {
			data: result.data[0],
			links: result.links,
			included: result.included,
		};
	}

	protected async convertRawRelease(rawRelease: SingleDataDocument<ReleaseResource>): Promise<HarmonyRelease> {
		this.entity = {
			id: rawRelease.data.id,
			type: rawRelease.data.type === 'videos' ? 'video' : 'album',
		};
		const attributes = rawRelease.data.attributes;
		const media = await this.getFullTracklist(rawRelease);
		const artwork = this.getArtwork(rawRelease);
		let types: ReleaseGroupType[] = [];
		if (rawRelease.data.type === 'videos') {
			types = ['Single'];
		} else if ('type' in attributes && attributes.type) {
			types = [capitalizeReleaseType(attributes.type)];
		}

		// Release copyright used to be a plain string, but is now an object, handle both.
		// Video/track copyright is still a plain string.
		let { copyright } = attributes;
		if (copyright && typeof copyright !== 'string') {
			copyright = copyright.text;
		}

		return {
			title: attributes.title,
			artists: this.getArtists(rawRelease),
			gtin: 'barcodeId' in attributes ? attributes.barcodeId : undefined,
			externalLinks: [{
				url: this.constructReleaseUrlFromRelease(rawRelease.data).href,
				types: this.provider.getLinkTypesForEntity(),
			}],
			media,
			releaseDate: parseHyphenatedDate(attributes.releaseDate),
			copyright: copyright ? formatCopyrightSymbols(copyright) : undefined,
			status: 'Official',
			types,
			packaging: 'None',
			images: artwork ? [artwork] : [],
			labels: this.getLabels(rawRelease),
			info: this.generateReleaseInfo(),
		};
	}

	private async getFullTracklist(rawRelease: SingleDataDocument<ReleaseResource>): Promise<HarmonyMedium[]> {
		if (rawRelease.data.type === 'videos') {
			return this.getFullVideoTracklist(rawRelease as SingleDataDocument<VideosResource>);
		} else {
			return await this.getFullAlbumTracklist(rawRelease as SingleDataDocument<AlbumsResource>);
		}
	}

	private getFullVideoTracklist(rawRelease: SingleDataDocument<VideosResource>): HarmonyMedium[] {
		const artistMap = new Map(
			this.getRelatedItems<ArtistsResource>(rawRelease, 'artists', 'artists').map((artist) => [artist.id, artist]),
		);

		// A video only contains a single track
		return [{
			number: 1,
			format: 'Digital Media',
			tracklist: [
				this.convertTrack(1, rawRelease.data, artistMap),
			],
		}];
	}

	private async getFullAlbumTracklist(rawRelease: SingleDataDocument<AlbumsResource>): Promise<HarmonyMedium[]> {
		const items: AlbumItemResourceIdentifier[] = rawRelease.data.relationships.items.data;
		const tracksMap = new Map<string, TracksResource | VideosResource>();
		const artistMap = new Map<string, ArtistsResource>();

		rawRelease.included.forEach((resource) => {
			if (resource.type === 'tracks' || resource.type === 'videos') {
				tracksMap.set(resource.id, resource);
			} else if (resource.type === 'artists') {
				artistMap.set(resource.id, resource);
			}
		});

		let next = rawRelease.data.relationships.items.links.next;
		while (next) {
			// The next URL does contain a query string. Hence url/join cannot be used,
			// as it only works with paths and does not preserve the query string.
			const url = new URL(next.replace(/^\//, ''), this.apiBaseUrl);
			url.searchParams.set('include', 'items.artists');

			const { content, timestamp } = await this.provider.query<MultiDataDocument<AlbumItemResourceIdentifier>>(url, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});

			items.push(...content.data);
			content.included.forEach((resource) => {
				if (resource.type === 'tracks' || resource.type === 'videos') {
					tracksMap.set(resource.id, resource);
				} else if (resource.type === 'artists') {
					artistMap.set(resource.id, resource);
				}
			});
			this.updateCacheTime(timestamp);
			next = content.links.next;
		}

		const realTrackCount = rawRelease.data.attributes.numberOfItems;
		if (items.length < realTrackCount) {
			this.addMessage(
				`The API returned only ${items.length} of ${realTrackCount} tracks for ${this.lookup.region}, other regions may have more`,
				'warning',
			);
		}

		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		items.forEach((item) => {
			const track = tracksMap.get(item.id);
			if (!track) {
				throw new ProviderError(
					this.provider.name,
					`No track data found for track ${item.meta.volumeNumber}-${item.meta.trackNumber}`,
				);
			}

			if (item.meta.volumeNumber !== medium.number) {
				if (medium.number) {
					result.push(medium);
				}

				medium = {
					number: item.meta.volumeNumber,
					format: 'Digital Media',
					tracklist: [],
				};
			}

			medium.tracklist.push(
				this.convertTrack(item.meta.trackNumber, track, artistMap),
			);
		});

		// store the final medium
		result.push(medium);

		return result;
	}

	private convertTrack(
		number: number,
		track: TracksResource | VideosResource,
		artistMap: Map<string, ArtistsResource>,
	): HarmonyTrack {
		const { title, version } = track.attributes;
		return {
			number: number,
			title: version ? `${title} (${version})` : title,
			length: parseISODuration(track.attributes.duration),
			isrc: track.attributes.isrc,
			artists: this.getTrackArtists(track, artistMap),
			type: track.type === 'videos' ? 'video' : 'audio',
			recording: {
				externalIds: this.provider.makeExternalIds({ type: track.type === 'videos' ? 'video' : 'track', id: track.id }),
			},
		};
	}

	private getTrackArtists(
		track: TracksResource | VideosResource,
		artistMap: Map<string, ArtistsResource>,
	): ArtistCreditName[] {
		const artists = track.relationships.artists.data;
		return artists.map((artist) => {
			const artistResource = artistMap.get(artist.id);
			if (!artistResource) {
				throw new ProviderError(
					this.provider.name,
					`No artist data found for artist ${artist.id}`,
				);
			}
			return {
				name: artistResource.attributes.name,
				creditedName: artistResource.attributes.name,
				externalIds: this.provider.makeExternalIds({ type: 'artist', id: artistResource.id }),
			};
		});
	}

	private getArtists(rawRelease: SingleDataDocument<ReleaseResource>): ArtistCreditName[] {
		const artists = this.getRelatedItems<ArtistsResource>(rawRelease, 'artists', 'artists');
		return artists
			.map((resource) => {
				return {
					name: resource.attributes.name,
					creditedName: resource.attributes.name,
					externalIds: this.provider.makeExternalIds({ type: 'artist', id: resource.id }),
				};
			});
	}

	private getArtwork(rawRelease: SingleDataDocument<ReleaseResource>): Artwork | undefined {
		let { imageLinks } = rawRelease.data.attributes;
		if (!imageLinks) {
			const relationship = rawRelease.data.type === 'videos' ? 'thumbnailArt' : 'coverArt';
			// @ts-ignore: Not all `relationship` values are keys of `AlbumsResource` and `VideosResource` (TODO: improve types)
			const artworks = this.getRelatedItems<ArtworksResource>(rawRelease, relationship, 'artworks');
			imageLinks = artworks.find((artwork) => artwork.attributes.mediaType === 'IMAGE')?.attributes.files ?? [];
			if (artworks.length > 1) {
				getLogger('harmony.provider').warn(`Tidal release ${rawRelease.data.id} has multiple artworks`);
			}
		}
		const allImages = imageLinks.map((link) => {
			return {
				url: link.href,
				width: link.meta.width,
				height: link.meta.height,
			};
		});
		return selectLargestImage(allImages, ['front']);
	}

	private getLabels(rawRelease: SingleDataDocument<ReleaseResource>): Label[] {
		const providers = this.getRelatedItems<ProvidersResource>(rawRelease, 'providers', 'providers');
		return providers
			.map((resource) => {
				return {
					name: resource.attributes.name,
					// On Tidal the providers (labels) have separate IDs, but there is no
					// corresponding public URL. Not setting the IDs here, as otherwise
					// Harmony would attempt to generate URLs.
					// externalIds: this.provider.makeExternalIds({ type: 'provider', id: resource.id })
				};
			});
	}

	private getRelatedItems<T>(
		rawRelease: SingleDataDocument<ReleaseResource>,
		relationship: keyof ReleaseResource['relationships'],
		resourceType: 'artists' | 'artworks' | 'providers',
	): T[] {
		const targetRels = rawRelease.data.relationships[relationship];
		const relatedIds = new Set(targetRels?.data?.map((item) => item.id));

		return rawRelease.included
			.filter((resource) => resource.type === resourceType && relatedIds.has(resource.id)) as T[];
	}

	private constructReleaseUrlFromRelease(release: ReleaseResource): URL {
		return this.provider.constructUrl({
			type: release.type === 'videos' ? 'video' : 'album',
			id: release.id,
		});
	}
}
