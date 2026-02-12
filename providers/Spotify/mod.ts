import { capitalizeReleaseType } from '@/harmonizer/release_types.ts';
import {
	type ApiAccessToken,
	type ApiQueryOptions,
	type CacheEntry,
	MetadataApiProvider,
	ReleaseApiLookup,
} from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { getFromEnv } from '@/utils/config.ts';
import { formatCopyrightSymbols } from '@/utils/copyright.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { selectLargestImage } from '@/utils/image.ts';
import { splitLabels } from '@/utils/label.ts';
import { ResponseError as SnapResponseError } from 'snap-storage';
import { encodeBase64 } from 'std/encoding/base64.ts';
import { availableRegions } from './regions.ts';

import type {
	Album,
	ApiError,
	Copyright,
	ResultList,
	SearchResult,
	SimplifiedArtist,
	SimplifiedTrack,
	Track,
	TrackList,
} from './api_types.ts';
import type {
	ArtistCreditName,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	LinkType,
} from '@/harmonizer/types.ts';

// See https://developer.spotify.com/documentation/web-api

const spotifyClientId = getFromEnv('HARMONY_SPOTIFY_CLIENT_ID') || '';
const spotifyClientSecret = getFromEnv('HARMONY_SPOTIFY_CLIENT_SECRET') || '';

export default class SpotifyProvider extends MetadataApiProvider {
	readonly name = 'Spotify';

	readonly supportedUrls = new URLPattern({
		hostname: 'open.spotify.com',
		pathname: '{/intl-:language}?/:type(artist|album|track)/:id',
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 2000,
		'duration precision': DurationPrecision.MS,
		'GTIN lookup': FeatureQuality.GOOD,
		'MBID resolving': FeatureQuality.GOOD,
		'release label': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
		recording: 'track',
	};

	override readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = SpotifyReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2008,
		month: 10,
	};

	readonly apiBaseUrl = 'https://api.spotify.com/v1/';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), 'https://open.spotify.com');
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['free streaming'];
	}

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
				throw new SpotifyResponseError(apiError, apiUrl);
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
				throw new SpotifyResponseError(apiError, apiUrl);
			} else {
				throw error;
			}
		}
	}

	private async requestAccessToken(): Promise<ApiAccessToken> {
		// See https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow
		const url = new URL('https://accounts.spotify.com/api/token');
		const auth = encodeBase64(`${spotifyClientId}:${spotifyClientSecret}`);
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

export class SpotifyReleaseLookup extends ReleaseApiLookup<SpotifyProvider, Album> {
	constructReleaseApiUrl(): URL {
		const { method, value, region } = this.lookup;
		let lookupUrl: URL;
		const query = new URLSearchParams();

		if (method === 'gtin') {
			lookupUrl = new URL('search', this.provider.apiBaseUrl);
			query.set('type', 'album');
			query.set('q', `upc:${value}`);
			if (region) {
				query.set('market', region);
			}
		} else { // if (method === 'id')
			lookupUrl = new URL(`albums/${value}`, this.provider.apiBaseUrl);
		}

		lookupUrl.search = query.toString();
		return lookupUrl;
	}

	protected async getRawRelease(): Promise<Album> {
		if (this.lookup.method === 'gtin') {
			const albumId = await this.queryAlbumIdByGtin(this.lookup.value);

			// No results found
			if (!albumId) {
				throw new ResponseError(this.provider.name, 'API returned no results', this.constructReleaseApiUrl());
			}

			// Result is a SimplifiedAlbum. Perform a regular ID lookup with the found release
			// ID to retrieve complete data.
			this.lookup.method = 'id';
			this.lookup.value = albumId;
		}

		const cacheEntry = await this.provider.query<Album>(this.constructReleaseApiUrl(), {
			snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
		});
		const release = cacheEntry.content;

		this.updateCacheTime(cacheEntry.timestamp);
		return release;
	}

	private async queryAlbumIdByGtin(gtin: string): Promise<string | undefined> {
		// Spotify does not always find UPC barcodes but expects them prefixed with
		// 0 to a length of 14 characters. E.g. "810121774182" gives no results,
		// but "00810121774182" does.
		const gtins = this.getGtinCandidates(gtin);
		// For GTIN lookups use the region
		for (const region of this.options?.regions || [undefined]) {
			this.lookup.region = region;
			for (const gtin of gtins) {
				this.lookup.value = gtin;
				const cacheEntry = await this.provider.query<SearchResult>(this.constructReleaseApiUrl(), {
					snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
				});
				this.updateCacheTime(cacheEntry.timestamp);
				const releases = cacheEntry.content?.albums?.items;
				if (releases?.length) {
					if (releases.length > 1) {
						this.warnMultipleResults(releases.slice(1).map((release) => release.external_urls?.spotify));
					}
					return releases[0].id;
				}
			}
		}

		return undefined;
	}

	private async getRawTracklist(rawRelease: Album): Promise<SimplifiedTrack[]> {
		const allTracks: SimplifiedTrack[] = [...rawRelease.tracks.items];

		// The initial response contains max. 50 tracks. Fetch the remaining
		// tracks with separate requests if needed.
		let nextUrl = rawRelease.tracks.next;
		while (nextUrl && allTracks.length < rawRelease.tracks.total) {
			const cacheEntry = await this.provider.query<ResultList<SimplifiedTrack>>(new URL(nextUrl), {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(cacheEntry.timestamp);
			allTracks.push(...cacheEntry.content.items);
			nextUrl = cacheEntry.content.next;
		}

		// Load full details including ISRCs
		if (this.options.withISRC) {
			return this.getRawTrackDetails(allTracks);
		} else {
			return allTracks;
		}
	}

	private async getRawTrackDetails(simplifiedTracks: SimplifiedTrack[]): Promise<Track[]> {
		const allTracks: Track[] = [];
		const trackIds = simplifiedTracks.map(this.getTrackId.bind(this));

		// The SimplifiedTrack entries do not contain ISRCs.
		// Perform track queries to obtain the full details of all tracks.
		// Each query can return up to 50 tracks.
		const maxResults = 50;
		const apiUrl = new URL('tracks', this.provider.apiBaseUrl);
		for (let index = 0; index < trackIds.length; index += maxResults) {
			apiUrl.searchParams.set('ids', trackIds.slice(index, index + maxResults).join(','));
			const cacheEntry = await this.provider.query<TrackList>(apiUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(cacheEntry.timestamp);
			allTracks.push(...cacheEntry.content.tracks);
		}

		return allTracks;
	}

	protected async convertRawRelease(rawRelease: Album): Promise<HarmonyRelease> {
		this.entity = {
			id: rawRelease.id,
			type: 'album',
		};
		const rawTracklist = await this.getRawTracklist(rawRelease);
		const media = this.convertRawTracklist(rawTracklist);
		const artwork = selectLargestImage(rawRelease.images, ['front']);
		return {
			title: rawRelease.name,
			artists: rawRelease.artists.map(this.convertRawArtist.bind(this)),
			gtin: rawRelease.external_ids?.ean || rawRelease.external_ids?.upc,
			externalLinks: [{
				url: rawRelease.external_urls.spotify,
				types: this.provider.getLinkTypesForEntity(),
			}],
			media,
			releaseDate: parseHyphenatedDate(rawRelease.release_date),
			copyright: this.getCopyright(rawRelease.copyrights),
			status: 'Official',
			types: [capitalizeReleaseType(rawRelease.album_type)],
			packaging: 'None',
			images: artwork ? [artwork] : [],
			labels: rawRelease.label ? splitLabels(rawRelease.label) : undefined,
			availableIn: rawRelease.available_markets,
			info: this.generateReleaseInfo(),
		};
	}

	private convertRawTracklist(tracklist: SimplifiedTrack[]): HarmonyMedium[] {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		// split flat tracklist into media
		tracklist.forEach((item) => {
			// store the previous medium and create a new one
			if (item.disc_number !== medium.number) {
				result.push(medium);

				medium = {
					number: item.disc_number,
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

	private convertRawTrack(track: SimplifiedTrack | Track): HarmonyTrack {
		const result: HarmonyTrack = {
			number: track.track_number,
			title: track.name,
			length: track.duration_ms,
			isrc: (track as Track).external_ids?.isrc,
			artists: track.artists.map(this.convertRawArtist.bind(this)),
			availableIn: track.available_markets,
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'track', id: this.getTrackId(track) }),
			},
		};

		return result;
	}

	/**
	 * Returns the correct track ID for the given track.
	 *
	 * For unavailable releases, Spotify tries to be smart and substitute track IDs with those of similar but available
	 * tracks, for which we have no use. In that case (and only then) the original IDs can be obtained from the optional
	 * `linked_from` track, otherwise we fall back to the regular ID.
	 * 
	 * @see https://developer.spotify.com/documentation/web-api/concepts/track-relinking
	 */
	private getTrackId(track: SimplifiedTrack): string {
		return track.linked_from?.id ?? track.id;
	}

	private convertRawArtist(artist: SimplifiedArtist): ArtistCreditName {
		return {
			name: artist.name,
			creditedName: artist.name,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: artist.id }),
		};
	}

	/**
	 * Returns a list of possible GTINs to search for.
	 *
	 * If a GTIN is shorter than 14 characters also try variants prefixed with 0
	 * to a maximum length of 14 characters.
	 *
	 * @param gtin Original GTIN.
	 * @returns GTIN variations to try to search.
	 */
	private getGtinCandidates(gtin: string): string[] {
		const candidates = [gtin];
		// Try padding to 14 characters, this seems to give results most often.
		// As a last fallback also try 13 characters.
		[14, 13].forEach((length) => {
			if (gtin.length < length) {
				candidates.push(gtin.padStart(length, '0'));
			}
		});
		return candidates;
	}

	private getCopyright(copyrights: Copyright[]): string {
		return copyrights.map(this.formatCopyright).join('\n');
	}

	private formatCopyright(copyright: Copyright): string {
		// As Spotify provides separate fields for copyright and phonographic
		// copyright those get often entered without the corresponding symbol.
		// When only importing the text entry the information gets lost. Hence
		// prefix the entries with the © or ℗ symbol if it is not already present.
		const symbol = copyright.type === 'P' ? '℗' : '©';
		return formatCopyrightSymbols(copyright.text, symbol);
	}
}

class SpotifyResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		super('Spotify', details?.error?.message, url);
	}
}
