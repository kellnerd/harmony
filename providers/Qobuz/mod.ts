import { capitalizeReleaseType } from '@/harmonizer/release_types.ts';
import { type ApiQueryOptions, type CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { getFromEnv } from '@/utils/config.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import {
	ArtistCreditName,
	Artwork,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	LinkType,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';
import {
	ApiError,
	QobuzAlbum,
	QobuzExtendedAlbum,
	QobuzPartialTrack,
	QobuzSearchResponse,
} from '@/providers/Qobuz/api_types.ts';
import { isEqualGTIN } from '../../utils/gtin.ts';

const qobuzAppId = getFromEnv('HARMONY_QOBUZ_APP_ID') || '';
const qobuzAuthToken = getFromEnv('HARMONY_QOBUZ_AUTH_TOKEN') || '';

export default class QobuzProvider extends MetadataApiProvider {
	readonly name = 'Qobuz';

	readonly supportedUrls = new URLPattern({
		hostname: '(play|www|open).qobuz.com',
		pathname: '/:locale?/:type(artist|album|track|interpreter|label)/:slug?/:id',
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 3000,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.GOOD,
		'MBID resolving': FeatureQuality.EXPENSIVE,
		'release label': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: ['artist', 'interpreter'],
		release: 'album',
		recording: 'track',
		label: 'label',
	};

	readonly releaseLookup = QobuzReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2007,
		month: 9,
		day: 18,
	};

	readonly apiBaseUrl = 'https://www.qobuz.com/api.json/0.2/';

	constructUrl(entity: EntityId): URL {
		if (entity.type == 'label') {
			return new URL([entity.type, entity.id].join('/'), 'https://play.qobuz.com'); //Qobuz doesn't have label pages on open.qobuz.com, but they do on play.qobuz.com
		}
		return new URL([entity.type, entity.id].join('/'), 'https://open.qobuz.com');
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['paid streaming', 'paid download'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
			requestInit: {
				headers: {
					'X-App-Id': qobuzAppId,
					'X-User-Auth-Token': qobuzAuthToken,
				},
			},
		});
		const error = cacheEntry.content as ApiError;
		if (error.message || error.code) {
			throw new QobuzResponseError(error, apiUrl);
		}
		return cacheEntry;
	}
}

export class QobuzReleaseLookup extends ReleaseApiLookup<QobuzProvider, QobuzAlbum> {
	/**
	 * Pads barcodes to 13 digits with leading zeros
	 * @param barcode Barcode to pad
	 * @returns Padded barcode
	 */
	private padBarcode(barcode: string): string {
		return barcode.padStart(13, '0');
	}

	constructReleaseApiUrl(): URL {
		if (this.lookup.method === 'gtin') {
			return new URL(`album/search?query=${this.padBarcode(String(this.lookup.value))}`, this.provider.apiBaseUrl);
		} else { // if (this.lookup.method === 'id')
			return new URL(`album/get?album_id=${this.lookup.value}`, this.provider.apiBaseUrl);
		}
	}

	protected async getRawRelease(): Promise<QobuzAlbum> {
		const apiUrl = this.constructReleaseApiUrl();
		if (this.lookup.method === 'gtin') {
			const { content: searchResponse, timestamp } = await this.provider.query<QobuzSearchResponse>(apiUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(timestamp);
			const matchingAlbum = searchResponse.albums?.items.find((album) => isEqualGTIN(album.upc, this.lookup.value));
			if (!matchingAlbum) {
				throw new ResponseError(this.provider.name, 'API returned no matching results', this.constructReleaseApiUrl());
			}
			this.lookup.method = 'id';
			this.lookup.value = matchingAlbum.id;

			const { content: release, timestamp: timestamp2 } = await this.provider.query<QobuzAlbum>(
				this.constructReleaseApiUrl(),
				{
					snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
				},
			);
			this.updateCacheTime(timestamp2);
			return release;
		} else {
			const { content: release, timestamp } = await this.provider.query<QobuzAlbum>(apiUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(timestamp);

			return release;
		}
	}

	protected convertRawRelease(rawRelease: QobuzAlbum): HarmonyRelease {
		this.entity = {
			id: rawRelease.id,
			type: 'album',
		};

		const linkTypes: LinkType[] = [];

		if (rawRelease.streamable) {
			linkTypes.push('paid streaming');
		}

		if (rawRelease.downloadable) {
			linkTypes.push('paid download');
		}

		return {
			title: rawRelease.title,
			artists: this.getAlbumCredits(rawRelease),
			media: this.getAlbumMedium(rawRelease),
			releaseDate: this.convertReleaseDate(parseHyphenatedDate(rawRelease.release_date_stream)),
			copyright: rawRelease.copyright || undefined,
			status: 'Official',
			types: this.mapAlbumType(rawRelease.release_type),
			packaging: 'None',
			images: this.getAlbumImage(rawRelease.image.small),
			labels: [{
				name: rawRelease.label.name,
				externalIds: this.provider.makeExternalIds({ type: 'label', id: String(rawRelease.label.id) }),
			}],
			externalLinks: [{
				url: this.provider.constructUrl(this.entity).toString(),
				types: linkTypes,
			}],
			info: this.generateReleaseInfo(),
			gtin: rawRelease.upc,
		};
	}

	private mapAlbumType(rawType: string | undefined): ReleaseGroupType[] | undefined {
		if (!rawType) return undefined;
		switch (rawType.toLocaleLowerCase()) {
			case 'epmini':
				return ['EP'];
			default:
				return [capitalizeReleaseType(rawType)];
		}
	}

	private getAlbumImage(url: string | undefined): Artwork[] | undefined {
		if (!url) return undefined;
		return [{
			url: url.replace(/_\d+/, '_org'),
			thumbUrl: url,
			types: ['front'],
		}];
	}

	private getAlbumCredits(album: QobuzExtendedAlbum): ArtistCreditName[] {
		const artists: ArtistCreditName[] = [];
		const artistIds: number[] = [];
		[album.artist, ...album.artists].forEach((artist) => {
			if (!artistIds.includes(artist.id)) {
				artists.push({
					name: artist.name,
					creditedName: artist.name,
					externalIds: this.provider.makeExternalIds({ type: 'artist', id: String(artist.id) }),
				});
				artistIds.push(artist.id);
			}
		});
		return artists;
	}

	private getAlbumMedium(album: QobuzAlbum): HarmonyMedium[] {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		const tracks = album.tracks?.items || [];
		tracks.forEach((track) => {
			if (track.media_number !== medium.number) {
				result.push(medium);
				medium = {
					number: track.media_number,
					format: 'Digital Media',
					tracklist: [],
				};
			}
			medium.tracklist.push(this.convertRawTrack(track));
		});
		result.push(medium);
		return result;
	}

	private convertRawTrack(rawTrack: QobuzPartialTrack): HarmonyTrack {
		return {
			title: `${rawTrack.title}${rawTrack.version ? ` (${rawTrack.version})` : ''}`,
			artists: undefined,
			number: rawTrack.track_number,
			length: rawTrack.duration * 1000,
			isrc: rawTrack.isrc,
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'track', id: String(rawTrack.id) }),
			},
		};
	}
}

class QobuzResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		super('Qobuz', `${details.message} (code ${details.code})`, url);
	}
}
