import { availableRegions } from './regions.ts';
import {
	type CacheEntry,
	DurationPrecision,
	MetadataProvider,
	type ProviderOptions,
	ReleaseLookup,
} from '@/providers/base.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { formatGtin } from '@/utils/gtin.ts';

import type { ApiError, MinimalArtist, Release, ReleaseTrack, Result, Track, TracklistItem } from './api_types.ts';
import type {
	ArtistCreditName,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	ReleaseOptions,
	ReleaseSpecifier,
} from '@/harmonizer/types.ts';

// See https://developers.deezer.com/api

export default class DeezerProvider extends MetadataProvider {
	constructor(options: ProviderOptions = {}) {
		super({
			rateLimitInterval: 5000,
			concurrentRequests: 50,
			...options,
		});
	}

	readonly name = 'Deezer';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.deezer.com',
		pathname: String.raw`/:language(\w{2})?/:type(album|artist)/:id(\d+)`,
	});

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
	};

	readonly availableRegions = new Set(availableRegions);

	readonly releaseLookup = DeezerReleaseLookup;

	readonly launchDate: PartialDate = {
		year: 2007,
		month: 8,
		day: 22,
	};

	readonly durationPrecision = DurationPrecision.SECONDS;

	readonly artworkQuality = 1400;

	readonly apiBaseUrl = 'https://api.deezer.com';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), 'https://www.deezer.com');
	}

	async query<Data>(apiUrl: URL, maxTimestamp?: number): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp },
		});
		const { error } = cacheEntry.content as { error?: ApiError };

		if (error) {
			throw new DeezerResponseError(error, apiUrl);
		}
		return cacheEntry;
	}
}

export class DeezerReleaseLookup extends ReleaseLookup<DeezerProvider, Release> {
	constructor(provider: DeezerProvider, specifier: ReleaseSpecifier, options: ReleaseOptions = {}) {
		super(provider, specifier, options);

		if (this.lookup.method === 'gtin') {
			// Deezer API only returns a result for a truncated GTIN with 12 digits (UPC) at least.
			this.lookup.value = formatGtin(this.lookup.value, 12);
		}
	}

	constructReleaseApiUrl(): URL {
		if (this.lookup.method === 'gtin') {
			return new URL(`album/upc:${this.lookup.value}`, this.provider.apiBaseUrl);
		} else { // if (this.lookup.method === 'id')
			return new URL(`album/${this.lookup.value}`, this.provider.apiBaseUrl);
		}
	}

	protected async getRawRelease(): Promise<Release> {
		const apiUrl = this.constructReleaseApiUrl();
		const { content: release, timestamp } = await this.provider.query<Release>(
			apiUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);

		return release;
	}

	private async getRawTracklist(albumId: string): Promise<TracklistItem[]> {
		const tracklist: TracklistItem[] = [];
		let nextPageQuery: string | undefined = `album/${albumId}/tracks`;

		while (nextPageQuery) {
			const { content, timestamp }: CacheEntry<Result<TracklistItem>> = await this.provider.query(
				new URL(nextPageQuery, this.provider.apiBaseUrl),
				this.options.snapshotMaxTimestamp,
			);
			tracklist.push(...content.data);
			nextPageQuery = content.next;
			this.updateCacheTime(timestamp);
		}

		return tracklist;
	}

	protected async getRawTrackById(trackId: string): Promise<Track> {
		const { content: track, timestamp } = await this.provider.query<Track>(
			new URL(`track/${trackId}`, this.provider.apiBaseUrl),
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);
		return track;
	}

	protected async convertRawRelease(rawRelease: Release): Promise<HarmonyRelease> {
		this.id = rawRelease.id.toString();
		const incompleteTracklist = rawRelease.nb_tracks > rawRelease.tracks.data.length;
		const needToFetchIndividualTracks = this.options.withAllTrackArtists || this.options.withAvailability || false;
		const needToFetchDetailedTracklist = incompleteTracklist ||
			(!needToFetchIndividualTracks && (this.options.withSeparateMedia || this.options.withISRC || false));

		let rawTracklist: Array<ReleaseTrack | TracklistItem | Track>;
		let media: HarmonyMedium[];

		if (needToFetchDetailedTracklist) {
			rawTracklist = await this.getRawTracklist(this.id);
		} else {
			rawTracklist = rawRelease.tracks.data;
		}

		if (needToFetchIndividualTracks) {
			// replace minimal tracklist with all available details for each track
			rawTracklist = await Promise.all(rawTracklist.map((track) => this.getRawTrackById(track.id.toString())));
		}

		if (needToFetchDetailedTracklist || needToFetchIndividualTracks) {
			// we have enough info to split the tracklist into multiple media
			media = this.convertRawTracklist(rawTracklist as Array<TracklistItem | Track>);
		} else {
			media = [{
				format: 'Digital Media',
				tracklist: rawTracklist.map(this.convertRawTrack.bind(this)),
			}];
		}

		const releaseUrl = new URL(rawRelease.link);
		const fallbackCoverUrl = new URL(`album/${this.id}/image`, this.provider.apiBaseUrl);

		return {
			title: rawRelease.title,
			artists: rawRelease.contributors.map(this.convertRawArtist.bind(this)),
			gtin: rawRelease.upc,
			externalLinks: [{
				url: releaseUrl,
				types: ['free streaming'],
			}],
			media,
			releaseDate: parseHyphenatedDate(rawRelease.release_date),
			// split label string using slashes if the results have at least 3 characters
			labels: rawRelease.label.split(/(?<=[^/]{3,})\/(?=[^/]{3,})/).map((label) => ({
				name: label.trim(),
			})),
			status: 'Official',
			packaging: 'None',
			images: [{
				url: new URL(rawRelease.cover_xl ?? fallbackCoverUrl),
				thumbUrl: new URL(rawRelease.cover_medium ?? fallbackCoverUrl),
				types: ['front'],
			}],
			availableIn: this.determineAvailability(media),
			info: this.generateReleaseInfo(),
		};
	}

	private convertRawTracklist(tracklist: Array<TracklistItem | Track>): HarmonyMedium[] {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			tracklist: [],
		};

		// split flat tracklist into media
		tracklist.forEach((item, index) => {
			// store the previous medium and create a new one
			if (item.disk_number !== medium.number) {
				if (medium.number) {
					result.push(medium);
				}

				medium = {
					number: item.disk_number,
					format: 'Digital Media',
					tracklist: [],
				};
			}

			medium.tracklist.push(this.convertRawTrack(item, index));
		});

		// store the final medium
		result.push(medium);

		return result;
	}

	private convertRawTrack(track: ReleaseTrack | TracklistItem | Track, index: number): HarmonyTrack {
		const result: HarmonyTrack = {
			number: index + 1,
			title: track.title,
			length: track.duration * 1000,
		};

		if ('isrc' in track) {
			// this is a detailed tracklist item
			result.isrc = track.isrc;
			result.number = track.track_position;
		}

		if ('contributors' in track) {
			// all available details about this track have been fetched
			result.artists = track.contributors.map(this.convertRawArtist.bind(this));
			result.availableIn = track.available_countries;
		} else {
			result.artists = [this.convertRawArtist(track.artist)];
		}

		return result;
	}

	private convertRawArtist(artist: MinimalArtist): ArtistCreditName {
		return {
			name: artist.name,
			creditedName: artist.name,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: artist.id.toString() }),
		};
	}

	private determineAvailability(media: HarmonyMedium[]): string[] | undefined {
		const tracks = media.flatMap((medium) => medium.tracklist);
		const lastTrack = tracks.pop();

		// Calculate the intersection of all tracks' availabilities with Deezer's availability.
		// Iterate over any of the usually smaller sets of track regions (here: last track) instead of Deezer's full set.
		const otherTrackAvailabilities = tracks.map((track) => new Set(track.availableIn));
		return lastTrack?.availableIn?.filter((region) =>
			otherTrackAvailabilities.every((availability) => availability.has(region)) &&
			this.provider.availableRegions.has(region)
		);
	}
}

class DeezerResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		super('Deezer', `${details.message} (code ${details.code})`, url);
	}
}
