import {
	type ApiAccessToken,
	type ApiQueryOptions,
	type CacheEntry,
	MetadataApiProvider,
	ReleaseApiLookup,
} from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, type FeatureQualityMap } from '@/providers/features.ts';
import type { PartialDate } from '@/utils/date.ts';
import { parseDuration } from '@/utils/time.ts';
import { ProviderError } from '@/utils/errors.ts';
import { getFromEnv } from '@/utils/config.ts';
import type {
	ArtistCreditName,
	Artwork,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	LinkType,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';
import type { BugsAlbum, BugsArtist, BugsMultiResponse, BugsTrack } from './api_types.ts';

const IMAGE_BASE = 'https://image.bugsm.co.kr/album/images';

const bugsDeviceId = getFromEnv('HARMONY_BUGS_DEVICE_ID') ?? 'harmony';

export default class BugsProvider extends MetadataApiProvider {
	readonly name = 'Bugs!';

	readonly supportedUrls = new URLPattern({
		hostname: 'music.bugs.co.kr',
		pathname: String.raw`/:type(album|track|artist)/:id(\d+)`,
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

	override readonly availableRegions = new Set(['KR']);

	readonly releaseLookup = BugsReleaseLookup;

	override readonly launchDate: PartialDate = {
		year: 2000,
		month: 2,
	};

	readonly apiBaseUrl = 'https://mapi.bugs.co.kr/music/5/multi/invoke/map';

	override get internalName(): string {
		return 'bugs';
	}

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), 'https://music.bugs.co.kr/');
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['paid streaming', 'paid download'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
		const albumId = Number(apiUrl.searchParams.get('album_id'));
		const body = JSON.stringify([
			{ id: 'album', args: { album_id: albumId, result_type: 'DETAIL' } },
			{ id: 'album_track', args: { album_id: albumId, result_type: 'LIST' } },
		]);
		if (bugsDeviceId) apiUrl.searchParams.set('device_id', bugsDeviceId);
		const accessToken = await this.cachedAccessToken(this.requestAccessToken);
		return this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
			requestInit: {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					'Authorization': `Bearer ${accessToken}`,
					'User-Agent': 'Mobile|Bugs|5.07.00|Android|16|SM-F936B|samsung|market|105070000',
					'X-BUGS-MS': '58239824',
					'Invoke-page': 'ALBUM_INFO',
					'Invoke-ids': 'album|album_track|',
				},
				body,
			},
		});
	}

	private async requestAccessToken(): Promise<ApiAccessToken> {
		const url = new URL('https://secure.bugs.co.kr/api/5/appToken');
		url.searchParams.set('client_id', 'bugsapp_credentials_android');
		url.searchParams.set('client_secret', 'd33b!z7xeu');
		url.searchParams.set('grant_type', 'client_credentials');
		url.searchParams.set('device_id', bugsDeviceId);
		const { result } = await (await fetch(url, { method: 'POST' })).json();
		return {
			accessToken: result.access_token,
			validUntilTimestamp: Date.now() + (result.expires_in * 1000),
		};
	}
}

export class BugsReleaseLookup extends ReleaseApiLookup<BugsProvider, BugsRawRelease> {
	constructReleaseApiUrl(): URL {
		const url = new URL(this.provider.apiBaseUrl);
		url.searchParams.set('album_id', this.lookup.value);
		return url;
	}

	protected async getRawRelease(): Promise<BugsRawRelease> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}
		const { content, timestamp } = await this.provider.query<BugsMultiResponse>(
			this.constructReleaseApiUrl(),
			{ snapshotMaxTimestamp: this.options.snapshotMaxTimestamp },
		);
		this.updateCacheTime(timestamp);

		let album: BugsAlbum | undefined;
		let tracks: BugsTrack[] = [];
		for (const section of content.list) {
			if ('album' in section) album = section.album.result;
			else if ('album_track' in section) tracks = section.album_track.list;
		}
		if (!album) throw new ProviderError(this.provider.name, 'Missing album section in response');
		return { album, tracks };
	}

	protected convertRawRelease(raw: BugsRawRelease): HarmonyRelease {
		this.entity = { id: String(raw.album.album_id), type: 'album' };

		const linkTypes: LinkType[] = [];
		if (raw.album.rights.streaming.service_yn) linkTypes.push('paid streaming');
		if (raw.album.rights.download.service_yn) linkTypes.push('paid download');

		return {
			title: raw.album.title,
			artists: raw.album.artists.map((a) => this.convertRawArtist(a)),
			releaseDate: this.convertReleaseDate(parseYYYYMMDD(raw.album.release_ymd)),
			labels: this.extractLabels(raw.album),
			images: [this.coverArtwork(raw.album.image.path)],
			types: mapReleaseType(raw.album.album_tp_nm),
			availableIn: ['KR'],
			status: 'Official',
			packaging: 'None',
			media: this.buildMedia(raw.tracks),
			externalLinks: [{
				url: this.provider.constructUrl(this.entity).toString(),
				types: linkTypes,
			}],
			info: this.generateReleaseInfo(),
		};
	}

	private convertRawArtist(artist: BugsArtist): ArtistCreditName {
		return {
			name: artist.artist_nm,
			creditedName: artist.artist_nm,
			externalIds: this.provider.makeExternalIds({ type: 'artist', id: String(artist.artist_id) }),
		};
	}

	private extractLabels(album: BugsAlbum): Label[] {
		return album.labels?.map((l) => ({ name: l.label_nm })) ?? [];
	}

	private coverArtwork(path: string): Artwork {
		return {
			url: `${IMAGE_BASE}/original${path}`,
			thumbUrl: `${IMAGE_BASE}/500${path}`,
			types: ['front'],
		};
	}

	private buildMedia(tracks: BugsTrack[]): HarmonyMedium[] {
		// Remove unavailable tracks like CD-only bonus tracks which are irrelevant for this digital provider
		const filteredTracks = tracks.filter((t) => t.rights.streaming.service_yn || t.rights.download.service_yn);
		const mediaMap = new Map<number, HarmonyMedium>();
		for (const track of filteredTracks) {
			if (!mediaMap.has(track.disc_id)) {
				mediaMap.set(track.disc_id, {
					number: track.disc_id,
					format: 'Digital Media',
					tracklist: [],
				});
			}
			mediaMap.get(track.disc_id)!.tracklist.push(this.convertRawTrack(track));
		}
		return [...mediaMap.values()].sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
	}

	private convertRawTrack(track: BugsTrack): HarmonyTrack {
		return {
			title: track.track_title,
			artists: track.artists.map((a) => this.convertRawArtist(a)),
			number: track.track_no,
			length: track.len ? parseDuration(track.len) * 1000 : undefined,
			recording: {
				externalIds: this.provider.makeExternalIds({ type: 'track', id: String(track.track_id) }),
			},
		};
	}
}

interface BugsRawRelease {
	album: BugsAlbum;
	tracks: BugsTrack[];
}

function parseYYYYMMDD(date: string): PartialDate {
	const match = date.match(/^(\d{4})(\d{2})(\d{2})$/);
	if (!match) return {};
	return {
		year: parseInt(match[1]),
		month: parseInt(match[2]),
		day: parseInt(match[3]),
	};
}

function mapReleaseType(albumType?: string): ReleaseGroupType[] | undefined {
	if (!albumType) return undefined;
	if (albumType.includes('EP') || albumType.includes('미니')) return ['EP'];
	if (albumType.includes('정규')) return ['Album'];
	if (albumType.includes('싱글')) return ['Single'];
	if (albumType.includes('베스트') || albumType.includes('컴필')) return ['Compilation'];
	if (albumType === 'OST') return ['Soundtrack'];
	if (albumType.includes('라이브')) return ['Live'];
	if (albumType.includes('리믹스')) return ['Remix'];
	return undefined;
}
