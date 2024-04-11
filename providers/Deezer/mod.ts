import { availableRegions } from './regions.ts';
import { DurationPrecision, MetadataProvider, ProviderOptions, ReleaseLookup } from '@/providers/base.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';

import type { ApiError, MinimalArtist, Release, ReleaseTrack, Response, Track, TracklistItem } from './api_types.ts';
import type { ArtistCreditName, HarmonyMedium, HarmonyRelease, HarmonyTrack } from '@/harmonizer/types.ts';

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
		pathname: String.raw`/:region(\w{2})?/album/:id(\d+)`,
	});

	readonly availableRegions = availableRegions;

	readonly releaseLookup = DeezerReleaseLookup;

	readonly launchDate: PartialDate = {
		year: 2007,
		month: 8,
		day: 22,
	};

	readonly durationPrecision = DurationPrecision.SECONDS;

	readonly artworkQuality = 1400;

	readonly apiBaseUrl = 'https://api.deezer.com';

	async query(apiUrl: URL) {
		const data = await this.fetchJSON(apiUrl);

		if (data.error) {
			throw new DeezerResponseError(data.error, apiUrl);
		}
		return data;
	}
}

export class DeezerReleaseLookup extends ReleaseLookup<DeezerProvider, Release> {
	readonly supportedUrls = new URLPattern({
		hostname: 'www.deezer.com',
		pathname: String.raw`/:region(\w{2})?/album/:id(\d+)`,
	});

	constructReleaseUrl(id: string): URL {
		return new URL(id, 'https://www.deezer.com/album/');
	}

	constructReleaseApiUrl(): URL {
		if (this.lookup.method === 'gtin') {
			return new URL(`album/upc:${this.lookup.value}`, this.provider.apiBaseUrl);
		} else { // if (this.lookup.method === 'id')
			return new URL(`album/${this.lookup.value}`, this.provider.apiBaseUrl);
		}
	}

	protected getRawRelease(): Promise<Release> {
		const apiUrl = this.constructReleaseApiUrl();
		return this.provider.query(apiUrl);
	}

	private async getRawTracklist(albumId: string): Promise<TracklistItem[]> {
		const tracklist: TracklistItem[] = [];
		let nextPageQuery: string | undefined = `album/${albumId}/tracks`;

		while (nextPageQuery) {
			const response: Response<TracklistItem> = await this.provider.query(
				new URL(nextPageQuery, this.provider.apiBaseUrl),
			);
			tracklist.push(...response.data);
			nextPageQuery = response.next;
		}

		return tracklist;
	}

	protected getRawTrackById(trackId: string): Promise<Track> {
		return this.provider.query(new URL(`track/${trackId}`, this.provider.apiBaseUrl));
	}

	protected async convertRawRelease(rawRelease: Release): Promise<HarmonyRelease> {
		this.id = rawRelease.id.toString();
		const needToFetchIndividualTracks = this.options.withAllTrackArtists || this.options.withAvailability || false;
		const needToFetchDetailedTracklist = !needToFetchIndividualTracks &&
			(this.options.withSeparateMedia || this.options.withISRC || false);

		let rawTracklist: Array<ReleaseTrack | TracklistItem | Track>;
		let media: HarmonyMedium[];

		if (needToFetchDetailedTracklist) {
			rawTracklist = await this.getRawTracklist(this.id);
		} else {
			rawTracklist = rawRelease.tracks.data;

			if (needToFetchIndividualTracks) {
				// replace minimal tracklist with all available details for each track
				rawTracklist = await Promise.all(rawTracklist.map((track) => this.getRawTrackById(track.id.toString())));
			}
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
				url: new URL(rawRelease.cover_xl),
				thumbUrl: new URL(rawRelease.cover_medium),
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
			duration: track.duration * 1000,
		};

		if ('isrc' in track) {
			// this is a detailed tracklist item
			result.isrc = track.isrc;
			result.number = track.track_position;
		}

		if ('contributors' in track) {
			// all available details about this track have been fetched
			result.artists = track.contributors.map(this.convertRawArtist);
			result.availableIn = track.available_countries;
		} else {
			result.artists = [this.convertRawArtist(track.artist)];
		}

		return result;
	}

	private convertRawArtist(artist: MinimalArtist): ArtistCreditName {
		return {
			name: artist.name,
			externalLink: new URL('https://www.deezer.com/artist/' + artist.id),
		};
	}

	private determineAvailability(media: HarmonyMedium[]): string[] | undefined {
		const trackAvailabilities = media.flatMap((medium) => medium.tracklist)
			.map((track) => new Set(track.availableIn));

		// calculate the intersection of all tracks' availabilities with Deezer's availability
		return this.provider.availableRegions.filter((country) =>
			trackAvailabilities.every((availability) => availability?.has(country))
		);
	}
}

class DeezerResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		super('Deezer', `${details.message} (code ${details.code})`, url);
	}
}
