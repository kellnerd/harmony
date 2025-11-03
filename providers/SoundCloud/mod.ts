import type {
	ArtistCreditName,
	Artwork,
	CountryCode,
	EntityId,
	HarmonyEntityType,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	LinkType,
} from '@/harmonizer/types.ts';
import {
	type ApiAccessToken,
	type ApiQueryOptions,
	type CacheEntry,
	MetadataApiProvider,
	ReleaseLookup,
} from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { getFromEnv } from '@/utils/config.ts';
import { isNotNull } from '@/utils/predicate.ts';
import { ApiError, RawRelease, SoundcloudPlaylist, SoundcloudTrack, SoundcloudUser } from './api_types.ts';
import { encodeBase64 } from 'std/encoding/base64.ts';
import { ResponseError as SnapResponseError } from 'snap-storage';
import { capitalizeReleaseType } from '../../harmonizer/release_types.ts';

const soundcloudClientId = getFromEnv('HARMONY_SOUNDCLOUD_CLIENT_ID') || '';
const soundcloudClientSecret = getFromEnv('HARMONY_SOUNDCLOUD_CLIENT_SECRET') || '';

export default class SoundCloudProvider extends MetadataApiProvider {
	readonly name = 'SoundCloud';

	readonly apiBaseUrl = new URL('https://api.soundcloud.com/');

	readonly releaseLookup = SoundCloudReleaseLookup;

	readonly supportedUrls = new URLPattern({
		hostname: 'soundcloud.com',
		pathname: '/:artist/:type(sets)?/:title',
	});

	readonly artistUrlPattern = new URLPattern({
		hostname: 'soundcloud.com',
		pathname: '/:artist/(albums|sets|tracks|popular-tracks|reposts)?',
	});

	readonly entityTypeMap = {
		artist: 'artist',
		// A set can be an album or a playlist.
		release: ['set', 'track'],
	};

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const artistResult = this.artistUrlPattern.exec(url);
		if (artistResult) {
			return {
				type: 'artist',
				id: artistResult.pathname.groups.artist!,
			};
		}

		const releaseResult = this.supportedUrls.exec(url);
		if (releaseResult) {
			const { artist, type, title } = releaseResult.pathname.groups;
			if (artist && title) {
				return {
					type: type === 'sets' ? 'set' : 'track',
					id: [artist, title].join('/'),
				};
			}
		}
	}

	constructUrl(entity: EntityId): URL {
		const baseUrl = 'https://soundcloud.com';
		const [artist, title] = entity.id.split('/', 2);
		if (entity.type === 'artist') return new URL(artist, baseUrl);

		if (!title) {
			throw new ProviderError(this.name, `Incomplete release ID '${entity.id}' does not match format \`artist/title\``);
		}
		if (entity.type === 'track') return new URL([artist, title].join('/'), baseUrl);
		return new URL([artist, 'sets', title].join('/'), baseUrl);
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
				return { id, type: 'set' };
			}
		} else {
			return { id, type: this.entityTypeMap[entityType] };
		}
	}

	override getLinkTypesForEntity(entity: EntityId): LinkType[] {
		if (entity.type != 'artist') {
			// All tracks offer free streaming, but some don't have free downloads enabled.
			return ['free streaming'];
		}
		// MB has special handling for Soundcloud artist URLs.
		return ['discography page'];
	}

	override readonly launchDate: PartialDate = {
		year: 2008,
		month: 10,
		day: 17,
	};

	override readonly features: FeatureQualityMap = {
		'cover size': 500,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.PRESENT,
	};

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
		try {
			await this.requestDelay;
			const accessToken = await this.cachedAccessToken(this.requestAccessToken);
			const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
				policy: { maxTimestamp: options.snapshotMaxTimestamp },
				requestInit: {
					headers: {
						'Authorization': `Bearer ${accessToken}`,
					},
				},
			});
			const apiError = cacheEntry.content as ApiError;
			if (apiError.error) {
				throw new SoundCloudResponseError(apiError, apiUrl);
			}
			return cacheEntry;
		} catch (error) {
			let apiError: ApiError | undefined;
			if (error instanceof SnapResponseError) {
				const { response } = error;
				this.handleRateLimit(response);
				// Retry API query when we encounter a 429 rate limit error.
				if (response.status === 429) {
					return this.query(apiUrl, options);
				}
				try {
					// Clone the response so the body of the original response can be
					// consumed later if the error gets re-thrown.
					apiError = await response.clone().json();
				} catch {
					// Ignore secondary JSON parsing error, rethrow original error.
				}
			}
			if (apiError?.error) {
				throw new SoundCloudResponseError(apiError, apiUrl);
			} else {
				throw error;
			}
		}
	}

	private async requestAccessToken(): Promise<ApiAccessToken> {
		// See https://developers.soundcloud.com/docs#authentication
		const url = new URL('https://secure.soundcloud.com/oauth/token');
		const auth = encodeBase64(`${soundcloudClientId}:${soundcloudClientSecret}`);
		const body = new URLSearchParams();
		body.append('grant_type', 'client_credentials');

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${auth}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: body,
		});

		const content = await response.json();
		return {
			accessToken: content?.access_token,
			validUntilTimestamp: Date.now() + (content.expires_in * 1000),
		};
	}
}

class SoundCloudResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		// While there exists a message field in the error response, it's usually empty, despite status being deprecated.
		super('SoundCloud', details?.status, url);
	}
}

export class SoundCloudReleaseLookup extends ReleaseLookup<SoundCloudProvider, RawRelease> {
	constructReleaseApiUrl(): URL {
		let lookupUrl: URL;
		const query = new URLSearchParams();
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		} else {
			// Entity is already defined for ID/URL lookups.
			const releaseUrl = this.provider.constructUrl(this.entity!);
			lookupUrl = new URL('resolve', this.provider.apiBaseUrl);
			query.set('url', releaseUrl.href);
		}
		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	async getRawRelease(): Promise<RawRelease> {
		const lookupUrl = this.constructReleaseApiUrl();
		// Entity is already defined for ID/URL lookups.
		const entityType = this.entity?.type;
		if (entityType === 'set') {
			const cacheEntry = await this.provider.query<SoundcloudPlaylist>(lookupUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(cacheEntry.timestamp);
			return cacheEntry.content;
		} else if (entityType === 'track') {
			const cacheEntry = await this.provider.query<SoundcloudTrack>(lookupUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(cacheEntry.timestamp);
			return cacheEntry.content;
		} else {
			throw new ProviderError(this.provider.name, `Unsupported release type '${entityType}'`);
		}
	}

	convertRawRelease(rawRelease: RawRelease): HarmonyRelease {
		// Entity is already defined for ID/URL lookups.
		const releaseUrl = this.provider.constructUrl(this.entity!);
		if (rawRelease.kind === 'track') {
			const rawTrack = rawRelease;
			const release: HarmonyRelease = {
				title: rawTrack.title,
				artists: [this.makeArtistCredit(rawTrack.user)],
				externalLinks: [{
					url: releaseUrl.href,
					types: this.getLinkTypes(rawTrack),
				}],
				media: [{
					format: 'Digital Media',
					tracklist: [this.convertRawTrack(rawTrack)],
				}],
				releaseDate: this.getReleaseDate(rawTrack),
				labels: this.getLabel(rawTrack),
				packaging: 'None',
				types: ['Single'],
				availableIn: this.getCountryCodes(rawTrack),
				info: this.generateReleaseInfo(),
				images: this.getArtwork(rawTrack),
			};
			return release;
		} else {
			const release: HarmonyRelease = {
				title: rawRelease.title,
				artists: [this.makeArtistCredit(rawRelease.user)],
				externalLinks: [{
					url: releaseUrl.href,
					types: this.getLinkTypes(rawRelease),
				}],
				media: [{
					format: 'Digital Media',
					tracklist: rawRelease.tracks?.filter(isNotNull).map(this.convertRawTrack.bind(this)) ?? [],
				}],
				releaseDate: this.getReleaseDate(rawRelease),
				labels: this.getLabel(rawRelease),
				packaging: 'None',
				types: rawRelease.playlist_type ? [capitalizeReleaseType(rawRelease.playlist_type)] : undefined,
				info: this.generateReleaseInfo(),
				images: this.getArtwork(rawRelease),
			};
			return release;
		}
	}

	getLinkTypes(release: RawRelease): LinkType[] {
		if (release.kind === 'playlist') {
			const types: LinkType[] = ['free streaming'];
			if (release.tracks?.length > 0) {
				if (release.tracks?.every((track) => track.downloadable)) {
					types.push('free download');
				}
			}
		} else if (release.kind === 'track') {
			const types: LinkType[] = ['free streaming'];
			if (release.downloadable) {
				types.push('free download');
			}
			return types;
		}
		return [];
	}

	getArtwork(release: RawRelease): Artwork[] | undefined {
		const artworks: Artwork[] = [];
		const artworkUrl = release.artwork_url;
		if (artworkUrl) {
			artworks.push({
				thumbUrl: artworkUrl.replace(/-(large|medium|small)\./, '-t300x300.'),
				url: artworkUrl.replace(/-(large|medium|small)\./, '-t500x500.'),
				types: ['front'],
				provider: this.provider.name,
			});
			return artworks;
		}
		return undefined;
	}

	getLabel(release: SoundcloudPlaylist | SoundcloudTrack): Label[] | undefined {
		if (release.kind === 'playlist') {
			if (release.label_name) {
				return [{
					name: release.label_name,
				}];
			} else if (release.tracks?.length > 0) {
				const labelName = release.tracks[0].label_name;
				if (labelName && release.tracks.every((track) => track.label_name === labelName)) {
					return [{
						name: labelName,
					}];
				}
			}
		} else if (release.kind === 'track') {
			if (release.label_name) {
				return [{
					name: release.label_name,
				}];
			}
		}
		return undefined;
	}

	getReleaseDate(release: SoundcloudTrack | SoundcloudPlaylist): PartialDate | undefined {
		if (release.release_year || release.release_month || release.release_day) {
			const date: PartialDate = {
				year: release.release_year || undefined,
				month: release.release_month || undefined,
				day: release.release_day || undefined,
			};
			return date;
		} else if (release.created_at) {
			return this.parseSoundcloudTimestamp(release.created_at);
		}
		return undefined;
	}

	/** Parses `YYYY/MM/DD HH:mm:ss +0000` timestamps. */
	parseSoundcloudTimestamp(timestamp: string): PartialDate | undefined {
		const dateMatch = timestamp.match(/^(\d{4})\/(\d{2})\/(\d{2}) \d{2}:\d{2}:\d{2} \+0000$/);
		if (dateMatch) {
			return {
				year: Number.parseInt(dateMatch[1]),
				month: Number.parseInt(dateMatch[2]),
				day: Number.parseInt(dateMatch[3]),
			};
		}
		return undefined;
	}

	convertRawTrack(rawTrack: SoundcloudTrack, index = 0): HarmonyTrack {
		const trackNumber = index + 1;
		return {
			number: trackNumber,
			title: rawTrack.title,
			artists: [this.makeArtistCredit(rawTrack.user)],
			length: rawTrack.duration,
			isrc: rawTrack.isrc || undefined,
			availableIn: this.getCountryCodes(rawTrack),
			recording: {
				externalIds: this.provider.makeExternalIdsFromUrl(rawTrack.permalink_url),
			},
		};
	}

	getCountryCodes(track: SoundcloudTrack): CountryCode[] | undefined {
		if (track.available_country_codes?.length) {
			return track.available_country_codes.map((code: string) => code.toUpperCase() as CountryCode);
		}
		return undefined;
	}

	makeArtistCredit(user: SoundcloudUser): ArtistCreditName {
		return {
			name: user.username,
			creditedName: user.username,
			externalIds: this.provider.makeExternalIdsFromUrl(user.permalink_url),
		};
	}
}
