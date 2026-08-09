import { type ApiQueryOptions, type CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, type FeatureQualityMap } from '@/providers/features.ts';
import type { ProviderCategory } from '@/providers/categories.ts';
import type { PartialDate } from '@/utils/date.ts';
import { ProviderError } from '@/utils/errors.ts';
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
	MelonAlbumInfo,
	MelonAlbumInfoResponse,
	MelonArtist,
	MelonDisc,
	MelonSong,
	MelonSongListResponse,
} from './api_types.ts';
import { splitLabels } from '@/utils/label.ts';

const API_BASE = 'https://m2.melon.com/m6/';

export default class MelonProvider extends MetadataApiProvider {
	readonly name = 'Melon';

	readonly supportedUrls = new URLPattern({
		hostname: ':subdomain(www|m2).melon.com',
		pathname: '/:type(album|song|artist)/:page(detail|music).htm',
		search: ':type(album|song|artist)Id=:id(\\d+){&*}?',
	});

	protected override idPattern = /^\d+$/;

	override readonly categories = new Set<ProviderCategory>(['digital']);

	override readonly features: FeatureQualityMap = {
		'cover size': 2000,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.PRESENT,
		'release label': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
		recording: 'song',
	};

	override readonly availableRegions = new Set(['KR']);

	readonly releaseLookup = MelonReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2004,
		month: 11,
	};

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const match = this.supportedUrls.exec(url);
		if (!match) return undefined;

		const { type: pathType } = match.pathname.groups;
		const { type: searchType, id } = match.search.groups;

		if (pathType !== searchType || !pathType || !id) {
			return undefined;
		}

		return { type: pathType, id: id };
	}

	constructUrl(entity: EntityId): URL {
		return new URL(`https://www.melon.com/${entity.type}/detail.htm?${entity.type}Id=${entity.id}`);
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['paid streaming', 'paid download'];
	}

	query<Data>(apiUrl: URL, options?: ApiQueryOptions): Promise<CacheEntry<Data>> {
		return this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options?.snapshotMaxTimestamp },
		});
	}
}

export class MelonReleaseLookup extends ReleaseApiLookup<MelonProvider, MelonRawRelease> {
	constructReleaseApiUrl(): URL {
		const url = new URL('v3/album/info.json', API_BASE);
		url.searchParams.set('albumId', this.lookup.value);
		return url;
	}

	protected async getRawRelease(): Promise<MelonRawRelease> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		const albumId = this.lookup.value;

		const infoUrl = this.constructReleaseApiUrl();
		const songListUrl = new URL('v2/album/song/list.json', API_BASE);
		songListUrl.searchParams.set('albumId', albumId);

		const snapshotMaxTimestamp = this.options.snapshotMaxTimestamp;
		const [infoEntry, songListEntry] = await Promise.all([
			this.provider.query<MelonAlbumInfoResponse>(infoUrl, { snapshotMaxTimestamp }),
			this.provider.query<MelonSongListResponse>(songListUrl, { snapshotMaxTimestamp }),
		]);

		this.updateCacheTime(infoEntry.timestamp);
		this.updateCacheTime(songListEntry.timestamp);

		// Deleted or nonexistent albums are indicated by a notification instead of the actual response data.
		const infoResponse = infoEntry.content.response;
		if (!infoResponse) {
			const notification = infoEntry.content.notification;
			throw new ProviderError(this.provider.name, notification?.message ?? 'Album not found');
		}

		const cdList = songListEntry.content.response?.CDLIST;
		if (!cdList) {
			const notification = songListEntry.content.notification;
			throw new ProviderError(this.provider.name, notification?.message ?? 'Album song list not found');
		}

		return {
			albumInfo: infoResponse.ALBUMINFO,
			albumType: infoResponse.ALBUMTYPE,
			planCnpy: infoResponse.PLANCNPY,
			cdList,
		};
	}

	protected convertRawRelease(raw: MelonRawRelease): HarmonyRelease {
		this.entity = { type: 'album', id: raw.albumInfo.ALBUMID };

		return {
			title: raw.albumInfo.ALBUMNAME,
			artists: raw.albumInfo.ARTISTLIST.map((a) => this.convertRawArtist(a)),
			releaseDate: this.convertReleaseDate(parseISSUEDATE(raw.albumInfo.ISSUEDATE)),
			labels: raw.planCnpy ? splitLabels(raw.planCnpy) : [],
			images: [this.coverArtwork(raw.albumInfo)],
			types: mapReleaseType(raw.albumType),
			availableIn: ['KR'],
			status: 'Official',
			packaging: 'None',
			media: this.buildMedia(raw.cdList),
			externalLinks: [{
				url: this.provider.constructUrl(this.entity).toString(),
				types: raw.albumInfo.ISSERVICE ? ['paid streaming', 'paid download'] : [],
			}],
			info: this.generateReleaseInfo(),
		};
	}

	private convertRawArtist(artist: MelonArtist): ArtistCreditName {
		return {
			name: artist.ARTISTNAME,
			creditedName: artist.ARTISTNAME,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: artist.ARTISTID }),
		};
	}

	private coverArtwork(albumInfo: MelonAlbumInfo): Artwork {
		const originalUrl = albumInfo.ALBUMIMGLARGE.replace(
			/(images\/.*\/[^/_]*)((_[^/.]*)_)?(_?[^/._]*)?(\.[^/.?]*)(?:[?/].*)?$/,
			'$1$3_org$5',
		);
		return {
			url: originalUrl,
			thumbUrl: albumInfo.ALBUMIMG,
			types: ['front'],
		};
	}

	private buildMedia(cdList: MelonDisc[]): HarmonyMedium[] {
		return cdList.map((disc) => ({
			number: parseInt(disc.CDNO),
			format: 'Digital Media',
			tracklist: disc.SONGLIST
				.filter((song) => song.ISSERVICE)
				.map((song) => this.convertRawTrack(song)),
		}));
	}

	private convertRawTrack(song: MelonSong): HarmonyTrack {
		return {
			title: song.SONGNAME,
			artists: song.ARTISTLIST.map((a) => this.convertRawArtist(a)),
			number: parseInt(song.TRACKNO),
			length: song.PLAYTIME ? parseInt(song.PLAYTIME) * 1000 : undefined,
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'song', id: song.SONGID }),
			},
		};
	}
}

interface MelonRawRelease {
	albumInfo: MelonAlbumInfo;
	albumType?: string;
	planCnpy?: string;
	cdList: MelonDisc[];
}

function parseISSUEDATE(date: string): PartialDate {
	const match = date.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
	if (!match) return {};
	return {
		year: parseInt(match[1]),
		month: parseInt(match[2]),
		day: parseInt(match[3]),
	};
}

function mapReleaseType(albumType?: string): ReleaseGroupType[] | undefined {
	if (!albumType) return undefined;
	if (albumType === '싱글') return ['Single'];
	if (albumType === '정규') return ['Album'];
	if (albumType === 'EP') return ['EP'];
	if (albumType === '베스트' || albumType === '옴니버스') return ['Compilation'];
	if (albumType === '라이브') return ['Live'];
	if (albumType === '리믹스') return ['Remix'];
	if (albumType === 'OST') return ['Soundtrack'];
	return undefined;
}
