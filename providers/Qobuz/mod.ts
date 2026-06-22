import { capitalizeReleaseType } from '@/harmonizer/release_types.ts';
import { type ApiQueryOptions, type CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import type { ProviderCategory } from '@/providers/categories.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { getFromEnv } from '@/utils/config.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { isEqualGTIN } from '@/utils/gtin.ts';
import type {
	ArtistCreditName,
	Artwork,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	LinkType,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';
import type {
	ApiError,
	QobuzAlbum,
	QobuzExtendedAlbum,
	QobuzMinimalArtist,
	QobuzPartialTrack,
	QobuzSearchResponse,
} from './api_types.ts';
import { availableRegionsAndLanguages, makeQobuzLocale } from './regions.ts';
import { ResponseError as SnapResponseError } from 'snap-storage';

const qobuzAppId = getFromEnv('HARMONY_QOBUZ_APP_ID') || '';

export default class QobuzProvider extends MetadataApiProvider {
	readonly name = 'Qobuz';

	readonly supportedUrls = new URLPattern({
		hostname: '(play|www|open).qobuz.com',
		pathname:
			'/:region(\\w{2}-\\w{2})?/:type(artist|album|track|interpreter|label)/:slug?{/download-streaming-albums}?/:id',
	});

	override readonly categories = new Set<ProviderCategory>(['digital']);

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

	override readonly availableRegions = new Set(Object.keys(availableRegionsAndLanguages));

	readonly releaseLookup = QobuzReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2007,
		month: 9,
		day: 18,
	};

	readonly apiBaseUrl = 'https://www.qobuz.com/api.json/0.2/';

	constructUrl(entity: EntityId): URL {
		let { type, region, slug } = entity;
		// Prefer the more reliable, localized www.qobuz.com URL if we know the region.
		if (region && type !== 'track') {
			const locale = makeQobuzLocale(region, entity.language);
			if (type === 'artist') {
				// For some reason www.qobuz.com artist URLs are invalid.
				type = 'interpreter';
			}
			if (!slug && type !== 'label') {
				// Use a placeholder slug, except for labels which would become invalid.
				slug = '-';
			}
			if (locale && slug) {
				if (type === 'label') {
					slug += '/download-streaming-albums';
				}
				return new URL([locale, type, slug, entity.id].join('/'), 'https://www.qobuz.com');
			}
		}
		// Fallback to open.qobuz.com URL without region and slug.
		if (entity.type === 'label') {
			// Qobuz doesn't have label pages on open.qobuz.com, but they do on play.qobuz.com
			return new URL([entity.type, entity.id].join('/'), 'https://play.qobuz.com');
		}
		return new URL([entity.type, entity.id].join('/'), 'https://open.qobuz.com');
	}

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const entityId = super.extractEntityFromUrl(url);
		if (entityId?.region) {
			// Split Qobuz locale into country and language.
			const [country, language] = entityId.region.split('-', 2);
			entityId.region = country;
			entityId.language = language.toLowerCase();
		}
		return entityId;
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['paid streaming', 'paid download'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
		try {
			const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
				policy: { maxTimestamp: options.snapshotMaxTimestamp },
				requestInit: {
					headers: {
						'X-App-Id': qobuzAppId,
					},
				},
			});
			const error = cacheEntry.content as ApiError;
			if (error.message) {
				throw new QobuzResponseError(error, apiUrl);
			}
			return cacheEntry;
		} catch (error) {
			let apiError: ApiError | undefined;
			if (error instanceof SnapResponseError) {
				try {
					// Clone the response so the body of the original response can be
					// consumed later if the error gets re-thrown.
					apiError = await error.response.clone().json();
				} catch {
					// Ignore secondary JSON parsing error, rethrow original error.
				}
			}
			if (apiError?.message) {
				throw new QobuzResponseError(apiError, apiUrl);
			} else {
				throw error;
			}
		}
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
			return new URL(`album/search?query=${this.padBarcode(this.lookup.value)}`, this.provider.apiBaseUrl);
		} else { // if (this.lookup.method === 'id')
			return new URL(`album/get?album_id=${this.lookup.value}`, this.provider.apiBaseUrl);
		}
	}

	protected async getRawRelease(): Promise<QobuzAlbum> {
		let apiUrl = this.constructReleaseApiUrl();
		if (this.lookup.method === 'gtin') {
			const { content: searchResponse, timestamp } = await this.provider.query<QobuzSearchResponse>(apiUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(timestamp);
			const matchingAlbum = searchResponse.albums?.items.find((album) => isEqualGTIN(album.upc, this.lookup.value));
			if (!matchingAlbum) {
				throw new ResponseError(this.provider.name, 'API returned no matching results', apiUrl);
			}
			this.lookup.method = 'id';
			this.lookup.value = matchingAlbum.id;
			apiUrl = this.constructReleaseApiUrl();
		}

		const { content: release, timestamp } = await this.provider.query<QobuzAlbum>(apiUrl, {
			snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
		});
		this.updateCacheTime(timestamp);

		// If the lookup region is not known (through the release URL), try to find a valid region in the options.
		if (!this.lookup.region && this.options.regions) {
			for (const region of this.options.regions) {
				if (makeQobuzLocale(region)) {
					this.lookup.region = region;
					break;
				}
			}
		}

		return release;
	}

	protected convertRawRelease(rawRelease: QobuzAlbum): HarmonyRelease {
		if (!this.entity) {
			this.entity = {
				id: rawRelease.id,
				type: 'album',
				slug: rawRelease.slug,
				region: this.lookup.region,
				language: this.lookup.language,
			};
		}

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
				externalIds: this.provider.makeExternalIds({
					type: 'label',
					id: String(rawRelease.label.id),
					slug: rawRelease.label.slug,
					// Prefer localized www URL as play.qobuz.com label URLs are only available for logged in users.
					// Infer label locale from release as there is no better source.
					region: this.lookup.region,
					language: this.lookup.language,
				}),
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

	private convertRawArtist(rawArtist: QobuzMinimalArtist): ArtistCreditName {
		const artist: ArtistCreditName = {
			name: rawArtist.name,
			creditedName: rawArtist.name,
		};
		if (rawArtist.id) {
			artist.externalIds = this.provider.makeExternalIds({ type: 'artist', id: String(rawArtist.id) });
		}
		return artist;
	}

	private getAlbumCredits(album: QobuzExtendedAlbum): ArtistCreditName[] {
		const artists: ArtistCreditName[] = [];
		const artistIds: number[] = [];
		[album.artist, ...album.artists].forEach((artist) => {
			if (!artistIds.includes(artist.id)) {
				artists.push(this.convertRawArtist(artist));
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
		const mainArtist = rawTrack.performer;
		const additionalArtists = this.parsePerformers(rawTrack.performers).filter(({ name, roles }) =>
			name !== mainArtist.name && roles.some((role) => role === 'MainArtist' || role === 'FeaturedArtist')
		);
		return {
			title: `${rawTrack.title}${rawTrack.version ? ` (${rawTrack.version})` : ''}`,
			artists: [mainArtist, ...additionalArtists].map(this.convertRawArtist.bind(this)),
			number: rawTrack.track_number,
			length: rawTrack.duration * 1000,
			isrc: rawTrack.isrc,
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'track', id: String(rawTrack.id) }),
			},
		};
	}

	private parsePerformers(performers?: string) {
		if (!performers) {
			return [];
		}
		return performers.split(' - ').map((performerAndRoles) => {
			const [performer, ...roles] = performerAndRoles.split(', ');
			return {
				name: performer,
				roles,
			};
		});
	}
}

class QobuzResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		let message = `${details.message} (code ${details.code})`;
		if (details.code === 404) {
			message += ' / API only returns results which are available in Harmony’s region';
		}
		super('Qobuz', message, url);
	}
}
