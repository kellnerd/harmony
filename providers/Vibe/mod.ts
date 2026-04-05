import { type ApiQueryOptions, type CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseHyphenatedDate, PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import {
	ArtistCreditName,
	Artwork,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	LinkType,
} from '@/harmonizer/types.ts';
import {
	ApiError,
	NaverAlbum,
	NaverAlbumResult,
	NaverArtistTracksResult,
	NaverPartialArtist,
	NaverParticipant,
	NaverResponse,
	NaverTrack,
	NaverTrackCreditsResult,
} from './api_types.ts';

export default class VibeProvider extends MetadataApiProvider {
	readonly name = 'Naver VIBE';

	override get internalName(): string {
		return 'vibe';
	}

	readonly supportedUrls = new URLPattern({
		hostname: 'vibe.naver.com',
		pathname: '/:type(artist|album|track)/:id(\\d+)',
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 3000,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.PRESENT,
		'release label': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
		recording: 'track',
	};

	readonly releaseLookup = VibeReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2018,
		month: 6,
		day: 11,
	};

	readonly apiBaseUrl = 'https://apis.naver.com/vibeWeb/musicapiweb/';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), 'https://vibe.naver.com/');
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['paid streaming', 'paid download'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
		});
		const error = cacheEntry.content as ApiError;
		if (error.response.message) {
			throw new VibeResponseError(error, apiUrl);
		}
		return cacheEntry;
	}
}

export class VibeReleaseLookup extends ReleaseApiLookup<VibeProvider, NaverAlbum> {
	constructReleaseApiUrl(): URL {
		return new URL(`album/${this.lookup.value}.json`, this.provider.apiBaseUrl);
	}

	protected async getRawRelease(): Promise<NaverAlbum> {
		const apiUrl = this.constructReleaseApiUrl();
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		} else {
			const { content, timestamp } = await this.provider.query<NaverResponse<NaverAlbumResult>>(apiUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(timestamp);
			return content.response.result.album;
		}
	}

	protected async convertRawRelease(rawRelease: NaverAlbum): Promise<HarmonyRelease> {
		this.entity = {
			id: String(rawRelease.albumId),
			type: 'album',
		};

		return {
			title: rawRelease.albumTitle,
			artists: rawRelease.artists.map((artist) => this.convertRawArtist(artist)),
			media: await this.getAlbumMedium(rawRelease),
			releaseDate: this.convertReleaseDate(parseHyphenatedDate(this.formatAlbumDate(rawRelease.releaseDate))),
			status: 'Official',
			packaging: 'None',
			images: this.getAlbumImage(rawRelease.imageUrl),
			labels: this.getAlbumLabels(rawRelease),
			externalLinks: [{
				url: this.provider.constructUrl(this.entity).toString(),
				types: this.provider.getLinkTypesForEntity(),
			}],
			info: this.generateReleaseInfo(),
		};
	}

	private getAlbumLabels(album: NaverAlbum): Label[] {
		const rawLabels = [album.agencyName, album.productionName].filter((label) => label != undefined && label != null);
		return rawLabels.map((label) => ({
			name: label,
		}));
	}

	private formatAlbumDate(date: string): string {
		return date.split('.').join('-');
	}

	private getAlbumImage(url: string | undefined): Artwork[] | undefined {
		if (!url) return undefined;
		const imgRegex = /https:\/\/musicmeta-phinf\.pstatic\.net\/[^?]*/;
		return [{
			url: url.match(imgRegex)?.[0] || url,
			thumbUrl: url,
			types: ['front'],
		}];
	}

	private convertRawArtist(rawArtist: NaverPartialArtist): ArtistCreditName {
		return {
			name: rawArtist.artistName,
			creditedName: rawArtist.artistName,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: String(rawArtist.artistId) }),
		};
	}

	private async getAlbumMedium(album: NaverAlbum): Promise<HarmonyMedium[]> {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		const tracks = (await this.getRawTracklist(album.albumId)).response.result.tracks;
		for (const track of tracks) {
			if (track.discNumber !== medium.number) {
				result.push(medium);
				medium = {
					number: track.discNumber,
					format: 'Digital Media',
					tracklist: [],
				};
			}
			medium.tracklist.push(await this.convertRawTrack(track));
		}
		result.push(medium);
		return result;
	}

	private async getRawTracklist(id: number): Promise<NaverResponse<NaverArtistTracksResult>> {
		const apiUrl = new URL(`album/${id}/tracks.json`, this.provider.apiBaseUrl);
		const { content: naverResult, timestamp } = await this.provider.query<NaverResponse<NaverArtistTracksResult>>(
			apiUrl,
			{
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			},
		);
		this.updateCacheTime(timestamp);
		return naverResult;
	}

	private async convertRawTrack(rawTrack: NaverTrack): Promise<HarmonyTrack> {
		return {
			title: rawTrack.trackTitle,
			// artists: rawTrack.artists.map((artist) => this.convertRawArtist(artist)), <- Misses featuring artist info
			artists: await this.getTrackArtists(rawTrack),
			number: rawTrack.trackNumber,
			length: this.getTrackDuration(rawTrack.playTime),
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'track', id: String(rawTrack.trackId) }),
			},
		};
	}

	private toParticipants(arists: NaverPartialArtist[]): NaverParticipant[] {
		return arists.map((artist) => {
			return ({
				name: artist.artistName,
				id: artist.artistId,
				likeCount: 0,
				imageUrl: artist.imageUrl || null,
			});
		});
	}

	private async getTrackArtists(rawTrack: NaverTrack): Promise<ArtistCreditName[]> {
		const trackFeatVariations = ['feat.', 'ft.', 'with'];
		if (!trackFeatVariations.some((fv) => rawTrack.trackTitle.toLocaleLowerCase().includes(fv))) {
			// Skip fetching credits if track name doesn't have some variation of 'feat.' since harmony can't use anything else at the moment
			// From what I can tell, all tracks on naver with featuring artists have one of the above variations in the title, even the ones with titles in other languages
			return rawTrack.artists.map((artist) => this.convertRawArtist(artist));
		}
		// Fetching credits is pretty inexpensive, so maybe ^ isn't neccesary to avoid extra calls
		const trackCredits = (await this.getRawTrackCredits(rawTrack.trackId)).response.result.trackCredits;
		const roles = trackCredits.participantGroupList;
		const featuringArtists = roles.filter((role) => role.roleName === '피쳐링').flatMap((role) => role.participantList);
		// const otherArtists = roles.flatMap((role) => role.participantList);
		// ^ other artist roles:
		// 작사 (Lyricist)
		// 작곡 (Composer)
		// 편곡 (Arranger)
		// 마스터링 엔지니어 (Mastering Engineer)
		// 믹싱 엔지니어 (Mixing Engineer)
		// 프로듀서 (Producer)
		// 지휘 (Conductor / Musical Director)
		//  --performance credits --
		// 백코러스 (Backing Vocals)
		// 트럼펫 (Trumpet)
		// 스트링 (Strings)
		// 피아노 (Piano)
		// ...
		const featuringIds = featuringArtists.map((artist) => artist.id);
		const allArtists = [...this.toParticipants(rawTrack.artists), ...featuringArtists];
		const uniqueArtists = Array.from(new Map(allArtists.map((artist) => [artist.id, artist])).values());
		const credits: ArtistCreditName[] = [];
		let hasMarkedFeat = false;
		uniqueArtists.forEach((aritst, index) => {
			const nextFeaturing = index < uniqueArtists.length - 1 && featuringIds.includes(uniqueArtists[index + 1].id);
			const secondNextFeaturing = index < uniqueArtists.length - 2 &&
				featuringIds.includes(uniqueArtists[index + 2].id);
			credits.push(this.convertRawParticipant(aritst, nextFeaturing, hasMarkedFeat, secondNextFeaturing));
			if (nextFeaturing) hasMarkedFeat = true;
		});
		return credits;
	}

	private convertRawParticipant(
		rawArtist: NaverParticipant,
		nextFeaturing = false,
		hasMarkedFeat = false,
		secondNextFeaturing = false,
	): ArtistCreditName {
		return {
			name: rawArtist.name,
			creditedName: rawArtist.name,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: String(rawArtist.id) }),
			joinPhrase: !hasMarkedFeat ? nextFeaturing ? ' feat. ' : secondNextFeaturing ? ' & ' : undefined : undefined,
		};
	}

	private async getRawTrackCredits(id: number): Promise<NaverResponse<NaverTrackCreditsResult>> {
		const apiUrl = new URL(`track/${id}/credits.json`, this.provider.apiBaseUrl);
		const { content: naverResult, timestamp } = await this.provider.query<NaverResponse<NaverTrackCreditsResult>>(
			apiUrl,
			{
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			},
		);
		this.updateCacheTime(timestamp);
		return naverResult;
	}

	private getTrackDuration(duration: string): number {
		const segments = duration.split(':');
		let ms = 0;
		if (segments.length == 2) {
			ms += Number(segments[0]) * 60 * 1000;
			ms += Number(segments[1]) * 1000;
		} else if (segments.length == 1) {
			ms += Number(segments[1]) * 1000;
		}
		return ms;
	}
}

class VibeResponseError extends ResponseError {
	constructor(readonly details: ApiError, url: URL) {
		super('Naver VIBE', `${details.response.message.text} (${details.response.message.apiStatusCode})`, url);
	}
}
