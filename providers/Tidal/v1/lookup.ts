import { join } from 'std/url/join.ts';
import { type CacheEntry, ReleaseApiLookup } from '@/providers/base.ts';
import { ProviderError } from '@/utils/errors.ts';
import { capitalizeReleaseType } from '@/harmonizer/release_types.ts';
import { formatCopyrightSymbols } from '@/utils/copyright.ts';
import { parseHyphenatedDate } from '@/utils/date.ts';
import { selectLargestImage } from '@/utils/image.ts';
import type TidalProvider from '@/providers/Tidal/mod.ts';

import type { Album, AlbumItem, Resource, Result, SimpleArtist } from './api_types.ts';
import type { ArtistCreditName, HarmonyMedium, HarmonyRelease, HarmonyTrack, Label } from '@/harmonizer/types.ts';

export class TidalV1ReleaseLookup extends ReleaseApiLookup<TidalProvider, Album> {
	readonly apiBaseUrl = 'https://openapi.tidal.com/';

	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		let lookupUrl: URL;
		const query = new URLSearchParams({
			countryCode: region || this.provider.defaultRegion,
		});
		if (method === 'gtin') {
			lookupUrl = join(this.apiBaseUrl, 'albums/byBarcodeId');
			query.append('barcodeId', value);
		} else { // if (method === 'id')
			lookupUrl = join(this.apiBaseUrl, 'albums', value);
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(): Promise<Album> {
		// Abort new lookups which would fail anyway, permalinks which use cached data should still work.
		if (!this.options.snapshotMaxTimestamp) {
			throw new ProviderError(
				this.provider.name,
				'New lookups stopped working after Tidal have silently removed their v1 API',
			);
		}

		if (!this.options.regions?.size) {
			this.options.regions = new Set([this.provider.defaultRegion]);
		}
		if (this.lookup.method === 'gtin') {
			const result = await this.queryAllRegions<Result<Album>>({
				isValidData: (data) => Boolean(data?.data?.length),
			});
			if (result.data.length > 1) {
				this.warnMultipleResults(result.data.slice(1).map((release) => release.resource.tidalUrl));
			}
			return result.data[0].resource;
		} else {
			const result = await this.queryAllRegions<Resource<Album>>({
				isValidData: (data) => Boolean(data?.resource),
				isCriticalError: (error: unknown) => {
					// If this was a 404 not found error, ignore it and try next region.
					const { response } = error as { response?: Response };
					return response?.status !== 404;
				},
			});
			return result.resource;
		}
	}

	private async getRawTracklist(albumId: string): Promise<AlbumItem[]> {
		const tracklist: AlbumItem[] = [];
		const url = join(this.apiBaseUrl, 'albums', albumId, 'items');
		const limit = 100;
		let offset = 0;
		const query = new URLSearchParams({
			countryCode: this.lookup.region || this.provider.defaultRegion,
			limit: String(limit),
			offset: String(offset),
		});

		while (true) {
			url.search = query.toString();
			const { content, timestamp }: CacheEntry<Result<AlbumItem>> = await this.provider.query(url, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			tracklist.push(...content.data.map((r) => r.resource));
			this.updateCacheTime(timestamp);
			if (!content.metadata.total || content.metadata.total <= tracklist.length) {
				break;
			}
			offset += limit;
			query.set('offset', String(offset));
		}

		return tracklist;
	}

	protected async convertRawRelease(rawRelease: Album): Promise<HarmonyRelease> {
		this.entity = {
			id: rawRelease.id,
			type: 'album',
		};
		const rawTracklist = await this.getRawTracklist(rawRelease.id);
		const media = this.convertRawTracklist(rawTracklist);
		const artwork = selectLargestImage(rawRelease.imageCover, ['front']);
		return {
			title: rawRelease.title,
			artists: rawRelease.artists.map(this.convertRawArtist.bind(this)),
			gtin: rawRelease.barcodeId,
			externalLinks: [{
				url: rawRelease.tidalUrl,
				types: this.provider.getLinkTypesForEntity(),
			}],
			media,
			releaseDate: parseHyphenatedDate(rawRelease.releaseDate),
			copyright: rawRelease.copyright ? formatCopyrightSymbols(rawRelease.copyright) : undefined,
			status: 'Official',
			types: [capitalizeReleaseType(rawRelease.type)],
			packaging: 'None',
			images: artwork ? [artwork] : [],
			labels: this.getLabels(rawRelease),
			info: this.generateReleaseInfo(),
		};
	}

	private convertRawTracklist(tracklist: AlbumItem[]): HarmonyMedium[] {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		// split flat tracklist into media
		tracklist.forEach((item) => {
			// store the previous medium and create a new one
			if (item.volumeNumber !== medium.number) {
				if (medium.number) {
					result.push(medium);
				}

				medium = {
					number: item.volumeNumber,
					format: 'Digital Media',
					tracklist: [],
				};
			}

			medium.tracklist.push(this.convertRawTrack(item));
		});

		// store the final medium
		result.push(medium);

		return result;
	}

	private convertRawTrack(track: AlbumItem): HarmonyTrack {
		const result: HarmonyTrack = {
			number: track.trackNumber,
			title: track.title,
			length: track.duration * 1000,
			isrc: track.isrc,
			artists: track.artists.map(this.convertRawArtist.bind(this)),
			type: track.artifactType === 'video' ? 'video' : 'audio',
		};

		return result;
	}

	private convertRawArtist(artist: SimpleArtist): ArtistCreditName {
		return {
			name: artist.name,
			creditedName: artist.name,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: artist.id.toString() }),
		};
	}

	private getLabels(rawRelease: Album): Label[] {
		// It is unsure whether providerInfo is actually used for some releases,
		// but it is documented in the API schemas.
		if (rawRelease.providerInfo?.providerName) {
			return [{
				name: rawRelease.providerInfo?.providerName,
			}];
		}

		return [];
	}
}
