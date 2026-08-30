import { type ApiQueryOptions, type CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, type FeatureQualityMap } from '@/providers/features.ts';
import type { ProviderCategory } from '@/providers/categories.ts';
import { parseCompactDate, type PartialDate } from '@/utils/date.ts';
import { ProviderError } from '@/utils/errors.ts';
import { splitLabels } from '@/utils/label.ts';
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
import type { GenieAlbumInfo, GenieAlbumResponse, GenieSong } from './api_types.ts';

const API_BASE = 'https://info.genie.co.kr/info/';

/** ID query parameters used by website URLs, per entity type. */
const entityIdParams: Record<string, string> = {
	album: 'axnm',
	song: 'xgnm',
	artist: 'xxnm',
};

export default class GenieProvider extends MetadataApiProvider {
	readonly name = 'Genie';

	readonly supportedUrls = new URLPattern({
		hostname: '(www.|mw.)?genie.co.kr',
		pathname: '/detail/:type(album|song|artist)Info',
		search: ':param(axnm|xgnm|xxnm)=:id(\\d+){&*}?',
	});

	protected override idPattern = /^\d+$/;

	override readonly categories = new Set<ProviderCategory>(['digital']);

	override readonly features: FeatureQualityMap = {
		'cover size': 600,
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

	readonly releaseLookup = GenieReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2012,
		month: 4,
		day: 2,
	};

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const match = this.supportedUrls.exec(url);
		if (!match) return undefined;

		const { type } = match.pathname.groups;
		const { param, id } = match.search.groups;

		if (!type || entityIdParams[type] !== param || !id) {
			return undefined;
		}

		return { type, id };
	}

	constructUrl(entity: EntityId): URL {
		return new URL(`https://www.genie.co.kr/detail/${entity.type}Info?${entityIdParams[entity.type]}=${entity.id}`);
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

export class GenieReleaseLookup extends ReleaseApiLookup<GenieProvider, GenieRawRelease> {
	constructReleaseApiUrl(): URL {
		const url = new URL('album', API_BASE);
		url.searchParams.set('axnm', this.lookup.value);
		return url;
	}

	protected async getRawRelease(): Promise<GenieRawRelease> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		const { content, timestamp } = await this.provider.query<GenieAlbumResponse>(
			this.constructReleaseApiUrl(),
			{ snapshotMaxTimestamp: this.options.snapshotMaxTimestamp },
		);
		this.updateCacheTime(timestamp);

		// Errors are returned with a 200 status code and are only indicated by the result code
		if (content.result?.ret_code !== '0') {
			throw new ProviderError(this.provider.name, content.result?.ret_msg ?? 'Album lookup failed');
		}

		const { album_info: albumInfo, album_song_list: songList } = content;
		if (!albumInfo || !songList) {
			throw new ProviderError(this.provider.name, 'Album not found');
		}

		return { albumInfo, songList };
	}

	protected convertRawRelease(raw: GenieRawRelease): HarmonyRelease {
		this.entity = { type: 'album', id: raw.albumInfo.album_id };

		const linkTypes: LinkType[] = [];
		if (raw.songList.some((song) => song.stream_service_yn === 'Y')) {
			linkTypes.push('paid streaming');
		}
		if (raw.songList.some((song) => song.down_service_yn === 'Y' || song.down_mp3_service_yn === 'Y')) {
			linkTypes.push('paid download');
		}

		return {
			title: raw.albumInfo.album_name,
			artists: [this.convertRawArtist(raw.albumInfo.artist_name, raw.albumInfo.artist_id)],
			releaseDate: this.convertReleaseDate(parseCompactDate(raw.albumInfo.album_release_dt)),
			// The "planner" (기획사) is the actual label, while the "producer" (유통사) is only the distributor
			labels: raw.albumInfo.album_planner ? splitLabels(raw.albumInfo.album_planner) : [],
			images: [this.coverArtwork(raw.albumInfo)],
			types: mapReleaseType(raw.albumInfo.album_type),
			availableIn: ['KR'],
			status: 'Official',
			packaging: 'None',
			media: this.buildMedia(raw.songList),
			externalLinks: [{
				url: this.provider.constructUrl(this.entity).toString(),
				types: linkTypes,
			}],
			info: this.generateReleaseInfo(),
		};
	}

	private convertRawArtist(name: string, id: string): ArtistCreditName {
		return {
			name,
			creditedName: name,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id }),
		};
	}

	private coverArtwork(albumInfo: GenieAlbumInfo): Artwork {
		// Image URLs are percent-encoded and end with a resize directive which reduces the image quality
		const imageUrl = decodeURIComponent(albumInfo.album_img_path600);
		return {
			url: imageUrl.replace(/\/dims\/.*$/, ''),
			thumbUrl: imageUrl,
			types: ['front'],
		};
	}

	private buildMedia(songList: GenieSong[]): HarmonyMedium[] {
		// Remove unavailable tracks like CD-only bonus tracks which are irrelevant for this digital provider
		const availableSongs = songList.filter((song) =>
			song.stream_service_yn === 'Y' || song.down_service_yn === 'Y' || song.down_mp3_service_yn === 'Y'
		);
		const mediaMap = new Map<number, HarmonyMedium>();
		for (const song of availableSongs) {
			const discNumber = parseInt(song.album_cd_no);
			if (!mediaMap.has(discNumber)) {
				mediaMap.set(discNumber, {
					number: discNumber,
					format: 'Digital Media',
					tracklist: [],
				});
			}
			mediaMap.get(discNumber)!.tracklist.push(this.convertRawTrack(song));
		}
		return [...mediaMap.values()].sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
	}

	private convertRawTrack(song: GenieSong): HarmonyTrack {
		return {
			title: song.song_name,
			artists: [this.convertRawArtist(song.artist_name, song.artist_id)],
			number: parseInt(song.album_track_no),
			length: song.duration ? parseInt(song.duration) * 1000 : undefined,
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'song', id: song.song_id }),
			},
		};
	}
}

interface GenieRawRelease {
	albumInfo: GenieAlbumInfo;
	songList: GenieSong[];
}

function mapReleaseType(albumType?: string): ReleaseGroupType[] | undefined {
	if (!albumType) return undefined;
	// Genie does not distinguish between singles and EPs, the harmonizer reduces these to a single primary type.
	if (albumType === '싱글/EP') return ['Single', 'EP'];
	if (albumType === '정규앨범') return ['Album'];
	if (albumType === '베스트/컬렉션' || albumType === '컴필레이션') return ['Compilation'];
	// The remaining type 기타앨범 ("other albums", used for OSTs and live albums among others) is left unmapped.
	return undefined;
}
