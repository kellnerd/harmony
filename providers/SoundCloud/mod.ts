import type {
	ArtistCreditName,
	Artwork,
	ArtworkType,
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
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { getFromEnv } from '@/utils/config.ts';
import { isNotNull } from '@/utils/predicate.ts';
import { ApiError, RawReponse, SoundcloudPlaylist, SoundcloudTrack, SoundcloudUser } from './api_types.ts';
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
		pathname: '/:artist/sets/:title',
	});

	readonly trackUrlPattern = new URLPattern({
		hostname: 'soundcloud.com',
		pathname: '/:artist/:title',
	});

	readonly artistUrlPattern = new URLPattern({
		hostname: 'soundcloud.com',
		pathname: '/:artist',
	});

	readonly entityTypeMap = {
		artist: 'user',
		release: ['playlist', 'track'],
	};

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const playlistResult = this.supportedUrls.exec(url);
		if (playlistResult) {
			const { title, artist } = playlistResult.pathname.groups;

			if (title) {
				return {
					type: 'playlist',
					id: [artist, title].join('/'),
				};
			}
		}
		const trackResult = this.trackUrlPattern.exec(url);
		if (trackResult) {
			const { title, artist } = trackResult.pathname.groups;
			if (title) {
				return {
					type: 'track',
					id: [artist, title].join('/'),
				};
			}
		}

		const artistResult = this.artistUrlPattern.exec(url);
		if (artistResult) {
			return {
				type: 'artist',
				id: artistResult.pathname.groups.artist!,
			};
		}
	}

	constructUrl(entity: EntityId): URL {
		const [artist, title] = entity.id.split('/', 2);
		if (entity.type === 'artist') return new URL(artist, 'https://soundcloud.com');

		if (!title) {
			throw new ProviderError(this.name, `Incomplete release ID '${entity.id}' does not match format \`user/title\``);
		}
		if (entity.type === 'track') return new URL([artist, title].join('/'), 'https://soundcloud.com');
		return new URL([artist, 'sets', title].join('/'), 'https://soundcloud.com');
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

	override getLinkTypesForEntity(entity: EntityId): LinkType[] {
		if (entity.type != 'artist') {
			// All tracks offer free streaming, but some don't have free downloads enabled.
			return ['free streaming'];
		}
		// MB has special handling for Soundcloud artist URLs
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

	//Soundcloud's client credentials authentication works surprisingly similarly to Spotify's https://developers.soundcloud.com/docs#authentication
	private async requestAccessToken(): Promise<ApiAccessToken> {
		// See https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
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
		super('SoundCloud', details?.status, url); //While there exists a message field in the error response, it's usually empty, despite status being deprecated.
	}
}

export class SoundCloudReleaseLookup extends ReleaseLookup<SoundCloudProvider, RawReponse> {
	rawReleaseUrl: URL | undefined;

	constructReleaseApiUrl(): URL | undefined {
		const { method, value } = this.lookup;
		let lookupUrl: URL;
		const query = new URLSearchParams();
		if (method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		} else {
			const entityId = this.provider.parseProviderId(value, 'release');
			const releaseUrl = this.provider.constructUrl(entityId);
			lookupUrl = new URL(`resolve`, this.provider.apiBaseUrl);
			query.set('url', releaseUrl.href);
		}
		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	async getRawRelease(): Promise<RawReponse> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		// Entity is already defined for ID/URL lookups.
		const webUrl = this.provider.constructUrl(this.entity!);
		const lookupUrl = new URL('resolve', this.provider.apiBaseUrl);
		lookupUrl.searchParams.set('url', webUrl.href);
		this.rawReleaseUrl = webUrl;
		if (this.entity!.type === 'playlist') {
			const cacheEntry = await this.provider.query<SoundcloudPlaylist>(lookupUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(cacheEntry.timestamp);
			const release = {
				apiResponse: cacheEntry.content,
				type: 'playlist' as const,
				href: webUrl.href,
			};
			return release;
		} else if (this.entity!.type === 'track') {
			const cacheEntry = await this.provider.query<SoundcloudTrack>(lookupUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(cacheEntry.timestamp);
			const release = {
				apiResponse: cacheEntry.content,
				type: 'track' as const,
				href: webUrl.href,
			};
			return release;
		} else {
			throw new ProviderError(this.provider.name, `Unsupported entity type '${this.entity!.type}'`);
		}
	}

	convertRawRelease(rawRelease: RawReponse): HarmonyRelease {
		const { apiResponse, type } = rawRelease;
		if (type == 'track') {
			const trackReponse = apiResponse as SoundcloudTrack;
			const release: HarmonyRelease = {
				title: trackReponse.title,
				artists: [this.makeArtistCredit(trackReponse.user)],
				externalLinks: [{
					url: rawRelease.href,
					types: this.getReleaseTypes(trackReponse),
				}],
				media: [{
					format: 'Digital Media',
					tracklist: [this.convertRawTrack(trackReponse)],
				}],
				releaseDate: this.getReleaseDate(trackReponse),
				labels: this.getLabel(trackReponse),
				packaging: 'None',
				types: ['Single'],
				availableIn: this.getCountryCodes(trackReponse),
				info: this.generateReleaseInfo(),
				images: this.getArtwork(trackReponse),
			};
			return release;
		} else {
			const playlistResponse = apiResponse as SoundcloudPlaylist;
			const release: HarmonyRelease = {
				title: playlistResponse.title,
				artists: [this.makeArtistCredit(playlistResponse.user)],
				externalLinks: [{
					url: rawRelease.href,
					types: this.getReleaseTypes(playlistResponse),
				}],
				media: [{
					format: 'Digital Media',
					tracklist: playlistResponse.tracks?.filter(isNotNull).map(this.convertRawTrack.bind(this)) ?? [],
				}],
				releaseDate: this.getReleaseDate(playlistResponse),
				labels: this.getLabel(playlistResponse),
				packaging: 'None',
				types: playlistResponse.playlist_type ? [capitalizeReleaseType(playlistResponse.playlist_type)] : undefined,
				info: this.generateReleaseInfo(),
				images: this.getArtwork(playlistResponse),
			};
			return release;
		}
	}

	getReleaseTypes(release: SoundcloudPlaylist | SoundcloudTrack): LinkType[] {
		if (release.kind === 'playlist') {
			const playlist = release as SoundcloudPlaylist;
			const types: LinkType[] = ['free streaming'];
			if (playlist.tracks?.length > 0) {
				if (playlist.tracks?.every((track) => track.downloadable)) {
					types.push('free download');
				}
			}
		} else if (release.kind === 'track') {
			const track = release as SoundcloudTrack;
			const types: LinkType[] = ['free streaming'];
			if (track.downloadable) {
				types.push('free download');
			}
			return types;
		}
		return [];
	}

	getArtwork(release: SoundcloudPlaylist | SoundcloudTrack): Artwork[] | undefined {
		const artworks: Artwork[] = [];
		const artworkUrl = release.artwork_url;
		if (artworkUrl) {
			artworks.push({
				thumbUrl: artworkUrl.replace(/-(large|medium|small)\./, '-t300x300.'),
				url: artworkUrl.replace(/-(large|medium|small)\./, '-t500x500.'),
				types: ['front' as ArtworkType],
				provider: this.provider.name,
			});
			return artworks;
		}
		return undefined;
	}

	getLabel(release: SoundcloudPlaylist | SoundcloudTrack): Label[] | undefined {
		if (release.kind === 'playlist') {
			const playlist = release as SoundcloudPlaylist;
			if (playlist.label_name) {
				const label: Label = {
					name: playlist.label_name,
				};
				return [label];
			} else {
				if (playlist.tracks?.length > 0) {
					const labelName = playlist.tracks[0].label_name;
					if (labelName && playlist.tracks.every((track) => track.label_name === labelName)) {
						return [{
							name: labelName,
						}];
					}
				}
			}
		} else if (release.kind === 'track') {
			const track = release as SoundcloudTrack;
			if (track.label_name) {
				const label: Label = {
					name: track.label_name,
				};
				return [label];
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
			const date = this.parseSoundcloudTimestamp(release.created_at);
			if (date) {
				return parseISODateTime(date.toISOString());
			}
		}
		return undefined;
	}

	parseSoundcloudTimestamp(timestamp: string): Date | undefined {
		const segments = timestamp.split(' ');
		if (segments.length === 3) {
			// Convert "2025/07/30 07:13:31 +0000" to "2025-07-30T07:13:31+00:00"
			const iso = segments[0].replace(/\//g, '-') + 'T' + segments[1] +
				segments[2].replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
			const date = new Date(iso);
			if (!isNaN(date.getTime())) {
				return date;
			}
		}
		return undefined;
	}

	convertRawTrack(rawTrack: SoundcloudTrack, index: number = 0): HarmonyTrack {
		const trackUrl: URL = new URL(rawTrack.permalink_url);
		const trackEntity = this.provider.extractEntityFromUrl(trackUrl);
		const trackNumber = index + 1;
		const track: HarmonyTrack = {
			number: trackNumber,
			title: rawTrack.title,
			artists: [this.makeArtistCredit(rawTrack.user)],
			length: rawTrack.duration,
			isrc: rawTrack.isrc || undefined,
			availableIn: this.getCountryCodes(rawTrack),
			recording: trackEntity ? { externalIds: this.provider.makeExternalIds(trackEntity) } : undefined,
		};
		return track;
	}

	getCountryCodes(track: SoundcloudTrack): CountryCode[] | undefined {
		if (track.available_country_codes?.length) {
			return track.available_country_codes.map((code: string) => code.toUpperCase() as CountryCode);
		}
		return undefined;
	}

	makeArtistCredit(user: SoundcloudUser): ArtistCreditName {
		const userUrl: URL = new URL(user.permalink_url);
		const userEntity = this.provider.extractEntityFromUrl(userUrl);
		return {
			name: user.username,
			creditedName: user.username,
			externalIds: userEntity ? this.provider.makeExternalIds(userEntity) : undefined,
		};
	}
}
