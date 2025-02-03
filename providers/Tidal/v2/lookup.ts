import { join } from 'std/url/join.ts';
import { ReleaseApiLookup } from '@/providers/base.ts';
import TidalProvider from '@/providers/Tidal/mod.ts';
import { ArtistCreditName, Artwork, HarmonyMedium, HarmonyRelease, Label } from '@/harmonizer/types.ts';
import { formatCopyrightSymbols } from '@/utils/copyright.ts';
import { capitalizeReleaseType } from '@/harmonizer/release_types.ts';
import { selectLargestImage } from '@/utils/image.ts';
import { ProviderError } from '@/utils/errors.ts';
import { parseHyphenatedDate } from '@/utils/date.ts';

import type {
	AlbumItemResourceIdentifier,
	AlbumsResource,
	ArtistsResource,
	MultiDataDocument,
	ProvidersResource,
	SingleDataDocument,
	TracksResource,
	VideosResource,
} from '@/providers/Tidal/v2/api_types.ts';

export class TidalV2ReleaseLookup extends ReleaseApiLookup<TidalProvider, SingleDataDocument<AlbumsResource>> {
	readonly apiBaseUrl = 'https://openapi.tidal.com/v2/';

	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		const lookupUrl = join(this.apiBaseUrl, `albums`);
		const query = new URLSearchParams({
			countryCode: region || this.provider.defaultRegion,
			include: ['artists', 'items', 'providers'].join(','),
		});
		if (method === 'gtin') {
			query.append('filter[barcodeId]', value);
		} else { // if (method === 'id')
			query.append('filter[id]', value);
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(): Promise<SingleDataDocument<AlbumsResource>> {
		if (!this.options.regions?.size) {
			this.options.regions = new Set([this.provider.defaultRegion]);
		}
		const isValidData = (data: MultiDataDocument<AlbumsResource>) => {
			return Boolean(data?.data?.length);
		};
		const result = await this.queryAllRegions<MultiDataDocument<AlbumsResource>>(isValidData);
		if (result.data.length > 1) {
			this.warnMultipleResults(
				result.data.slice(1).map((release) => {
					return this.provider.constructUrl({ type: 'album', id: release.id });
				}),
			);
		}
		return {
			data: result.data[0],
			links: result.links,
			included: result.included,
		};
	}

	protected async convertRawRelease(rawRelease: SingleDataDocument<AlbumsResource>): Promise<HarmonyRelease> {
		this.id = rawRelease.data.id;
		const attributes = rawRelease.data.attributes;
		const media = await this.getFullTracklist(rawRelease);
		const artwork = this.getArtwork(rawRelease);
		return {
			title: attributes.title,
			artists: this.getArtists(rawRelease),
			gtin: attributes.barcodeId,
			externalLinks: [{
				url: this.provider.constructUrl({ type: 'album', id: rawRelease.data.id }),
				types: this.provider.getLinkTypesForEntity(),
			}],
			media,
			releaseDate: parseHyphenatedDate(attributes.releaseDate),
			copyright: attributes.copyright ? formatCopyrightSymbols(attributes.copyright) : undefined,
			status: 'Official',
			types: [capitalizeReleaseType(attributes.type)],
			packaging: 'None',
			images: artwork ? [artwork] : [],
			labels: this.getLabels(rawRelease),
			info: this.generateReleaseInfo(),
		};
	}

	private async getFullTracklist(rawRelease: SingleDataDocument<AlbumsResource>): Promise<HarmonyMedium[]> {
		const items: AlbumItemResourceIdentifier[] = rawRelease.data.relationships.items.data;

		let next = rawRelease.data.relationships.items.links.next;
		while (next) {
			// The next URL does contain a query string. Hence url/join cannot be used,
			// as it only works with paths and does not preserve the query string.
			const url = new URL(next.replace(/^\//, ''), this.apiBaseUrl);
			const { content, timestamp } = await this.provider
				.query<MultiDataDocument<AlbumItemResourceIdentifier>>(
					url,
					this.options.snapshotMaxTimestamp,
				);
			items.push(...content.data);
			this.updateCacheTime(timestamp);
			next = content.links.next;
		}

		const trackIds = items.filter((i) => i.type == 'tracks').map((item) => item.id);
		const trackDetails = await this.loadTrackDetails(trackIds, 'tracks');
		const videoIds = items.filter((i) => i.type == 'videos').map((item) => item.id);
		const videoDetails = await this.loadTrackDetails(videoIds, 'videos');
		trackDetails.tracks = new Map([...trackDetails.tracks, ...videoDetails.tracks]);
		trackDetails.artists = new Map([...trackDetails.artists, ...videoDetails.artists]);

		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		items.forEach((item) => {
			const track = trackDetails.tracks.get(item.id) as TracksResource | VideosResource;
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

			medium.tracklist.push({
				number: item.meta.trackNumber,
				title: track.attributes.title,
				length: parseDuration(track.attributes.duration),
				isrc: track.attributes.isrc,
				artists: this.getTrackArtists(track, trackDetails.artists),
				type: item.type === 'videos' ? 'video' : 'audio',
			});
		});

		// store the final medium
		result.push(medium);

		return result;
	}

	private async loadTrackDetails(trackIds: string[], type: 'tracks' | 'videos'): Promise<TrackDetails> {
		const allTracks: TracksResource[] = [];
		const artistMap = new Map<string, ArtistsResource>();

		// Fetch full track details, including track artists, for up to 20 tracks in one call.
		const maxResults = 20;
		for (let index = 0; index < trackIds.length; index += maxResults) {
			const apiUrl = join(this.apiBaseUrl, type);
			apiUrl.searchParams.set('countryCode', this.lookup.region || this.provider.defaultRegion);
			apiUrl.searchParams.set('include', 'artists');
			apiUrl.searchParams.set('filter[id]', trackIds.slice(index, index + maxResults).join(','));
			const { content, timestamp } = await this.provider.query<MultiDataDocument<TracksResource>>(
				apiUrl,
				this.options.snapshotMaxTimestamp,
			);
			this.updateCacheTime(timestamp);
			allTracks.push(...content.data);
			for (const artist of content.included.filter((resource) => resource.type === 'artists')) {
				artistMap.set(artist.id, artist as ArtistsResource);
			}
		}

		return {
			tracks: new Map(allTracks.map((track) => [track.id, track])),
			artists: artistMap,
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

	private getArtists(rawRelease: SingleDataDocument<AlbumsResource>): ArtistCreditName[] {
		const artists = this.getRelatedItems<ArtistsResource>(rawRelease, 'artists');
		return artists
			.map((resource) => {
				return {
					name: resource.attributes.name,
					creditedName: resource.attributes.name,
					externalIds: this.provider.makeExternalIds({ type: 'artist', id: resource.id }),
				};
			});
	}

	private getArtwork(rawRelease: SingleDataDocument<AlbumsResource>): Artwork | undefined {
		const allImages = rawRelease.data.attributes.imageLinks.map((link) => {
			return {
				url: link.href,
				width: link.meta.width,
				height: link.meta.height,
			};
		});
		return selectLargestImage(allImages, ['front']);
	}

	private getLabels(rawRelease: SingleDataDocument<AlbumsResource>): Label[] {
		const providers = this.getRelatedItems<ProvidersResource>(rawRelease, 'providers');
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
		rawRelease: SingleDataDocument<AlbumsResource>,
		resourceType: 'artists' | 'providers',
	): T[] {
		const relatedIds = new Set(rawRelease.data.relationships[resourceType].data.map((item) => item.id));

		return rawRelease.included
			.filter((resource) => resource.type === resourceType && relatedIds.has(resource.id)) as T[];
	}
}

function parseDuration(duration: string): number {
	// Convert ISO-8601 duration (e.g. PT41M5S) to milliseconds
	const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) {
		return 0;
	}
	const hours = match[1] ? parseInt(match[1], 10) : 0;
	const minutes = match[2] ? parseInt(match[2], 10) : 0;
	const seconds = match[3] ? parseInt(match[3], 10) : 0;
	return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}

type TrackDetails = {
	tracks: Map<string, TracksResource | VideosResource>;
	artists: Map<string, ArtistsResource>;
};
