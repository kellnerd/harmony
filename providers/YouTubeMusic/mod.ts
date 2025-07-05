import { primaryTypeIds } from '@kellnerd/musicbrainz/data/release-group';
import type {
	ArtistCreditName,
	EntityId,
	HarmonyEntityType,
	HarmonyRelease,
	HarmonyTrack,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';
import { MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, type FeatureQualityMap } from '@/providers/features.ts';
import { ProviderError } from '@/utils/errors.ts';
import { extractTextFromHtml } from '@/utils/html.ts';
import { isDefined } from '@/utils/predicate.ts';
import type { Album, BrowseEndpoint, Playlist, Renderer, SearchResult, TextRun } from './api_types.ts';
import { BROWSE_URL, SEARCH_URL, USER_AGENT, YOUTUBEI_BODY, YOUTUBEI_HEADERS } from './constants.ts';

// Avoid typos when repeating entity types
const CHANNEL = 'channel';
const PLAYLIST = 'playlist';
const BROWSE = 'browse';
const WATCH = 'watch';

export default class YouTubeMusicProvider extends MetadataProvider {
	async search(
		query: string,
		/**
		 * Search params encoded using (protobuf-related?) binary format,
		 * see https://github.com/LuanRT/YouTube.js/blob/1705470558bcf402cec8b673e7dd977940cdd6b8/src/core/clients/Music.ts#L131-L140
		 */
		params?: string,
	) {
		// Add hash (which is ignored by YouTube) to distinguish URLs in cache
		return (await this.fetchJSON<SearchResult>(new URL(`#${query}${params ? `#${params}` : ''}`, SEARCH_URL), {
			requestInit: {
				method: 'POST',
				headers: YOUTUBEI_HEADERS,
				redirect: 'follow',
				body: JSON.stringify({
					...YOUTUBEI_BODY,
					query,
					params,
				}),
			},
		}));
	}

	async browse<T>(browseId: string) {
		// Add hash (which is ignored by YouTube) to distinguish URLs in cache
		return await this.fetchJSON<T>(new URL(`#${browseId}`, BROWSE_URL), {
			requestInit: {
				method: 'POST',
				headers: YOUTUBEI_HEADERS,
				redirect: 'follow',
				body: JSON.stringify({
					...YOUTUBEI_BODY,
					browseId,
				}),
			},
		});
	}

	/**
	 * HTML page of YouTube Music pages (like playlists) contains initial JSON data for further requests
	 */
	async extractEmbeddedJson(url: URL) {
		return (await this.fetchJSON<{ INITIAL_ENDPOINT: string }>(url, {
			requestInit: {
				headers: {
					'user-agent': USER_AGENT,
				},
			},
			responseMutator: async (response) => {
				const html = await response.text();
				const json = extractTextFromHtml(html, /ytcfg\.set\((.+?)\);/);
				if (!json) {
					throw new ProviderError(this.name, 'Failed to parse JSON from HTML');
				}
				return new Response(json, response);
			},
		}));
	}

	readonly entityTypeMap: Record<HarmonyEntityType, string | string[]> = {
		artist: CHANNEL,
		release: [PLAYLIST, BROWSE],
	};

	override readonly features: FeatureQualityMap = {
		'MBID resolving': FeatureQuality.GOOD,
		'GTIN lookup': FeatureQuality.GOOD,
		'duration precision': DurationPrecision.SECONDS,
	};

	protected releaseLookup = YouTubeMusicReleaseLookup;

	readonly name = 'YouTube Music';

	/**
	 * Accepts:
	 * - https://{(music|www).}?youtube.com/channel/:channel_id
	 * - https://music.youtube.com/browse/:browse_id
	 * - https://{(music|www).}?youtube.com/playlist?list=:playlist_id
	 * - https://{(music|www).}?youtube.com/watch?v=:watch_id
	 */
	readonly supportedUrls = new URLPattern({
		hostname: '{(music|www).}?youtube.com',
		pathname: '/:type(playlist|channel|browse|watch)/:id?',
	});

	// Override entity extraction since we also need to also extract id from search
	override extractEntityFromUrl(url: URL) {
		const matched = this.supportedUrls.exec(url);

		if (matched?.pathname.input.startsWith('/browse') && !(matched.hostname.input.startsWith('music'))) {
			throw new ProviderError(this.name, '`/browse` URLs are only valid with a `music.youtube.com` hostname');
		}

		const type = matched?.pathname.groups.type;

		if (type) {
			let id: string | null | undefined;

			switch (type) {
				case WATCH:
					id = url.searchParams.get('v');
					break;
				case PLAYLIST:
					id = url.searchParams.get('list');
					break;
				default:
					id = matched?.pathname.groups.id;
			}

			if (id) {
				return { type, id };
			}
		}
	}

	override constructUrl(entity: EntityId): URL {
		let url: string;

		switch (entity.type) {
			case WATCH:
				url = `watch?v=${entity.id}`;
				break;
			case PLAYLIST:
				url = `playlist?list=${entity.id}`;
				break;
			default:
				url = `${entity.type}/${entity.id}`;
		}

		return new URL(
			url,
			'https://music.youtube.com',
		);
	}

	override parseProviderId(id: string, entityType: HarmonyEntityType): EntityId {
		if (entityType === 'release') {
			if (id.startsWith('OLAK5uy_')) {
				// Album playlist ids always have prefix 'OLAK5uy_':
				// https://wiki.archiveteam.org/index.php/YouTube/Technical_details#Playlists
				return { type: PLAYLIST, id };
			} else if (id.startsWith('MPREb_')) {
				// Album browse ids always seem to have prefix 'MPREb_'
				return { type: BROWSE, id };
			} else {
				throw new ProviderError(this.name, `Release id '${id}' has invalid prefix, most likely not a valid release`);
			}
		} else {
			return super.parseProviderId(id, entityType);
		}
	}
}

type YouTubeMusicRelease = { playlist: Playlist; album: Album };

export class YouTubeMusicReleaseLookup extends ReleaseLookup<YouTubeMusicProvider, YouTubeMusicRelease> {
	override constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	protected override async getRawRelease(): Promise<YouTubeMusicRelease> {
		const { type, id } = (this.lookup.method === 'gtin')
			? await this.lookupGTIN()
			: this.provider.parseProviderId(this.lookup.value, 'release');

		let playlist: Playlist;
		let album: Album | undefined;

		if (type === PLAYLIST) {
			playlist = await this.fetchPlaylist(id);
			album = await this.albumFromPlaylist(id);
		} else {
			album = await this.fetchAlbum(id);
			playlist = await this.playlistFromAlbum(album);
		}

		return { playlist, album };
	}

	/**
	 * When searching YouTube Music for a GTIN in quotes, the first (and only) search result usually seems to be the album with that GTIN
	 * There are
	 */
	private async lookupGTIN(): Promise<EntityId> {
		const { content, timestamp } = await this.provider.search(
			`"${this.lookup.value}"`,
			/* Parameter for filtering for albums */ 'EgWKAQIYAWoSEAMQBBAJEA4QChAFEBEQEBAV',
		)
			.catch((reason) => {
				throw new ProviderError(
					this.provider.name,
					`Failed to lookup GTIN '${this.lookup.value}': ${reason}`,
				);
			});

		this.updateCacheTime(timestamp);

		const tab = content
			.contents
			.tabbedSearchResultsRenderer
			.tabs
			.find((tab) => tab.tabRenderer.selected)
			?.tabRenderer;

		const id = tab
			?.content
			.sectionListRenderer
			.contents
			.find((renderer) => 'musicShelfRenderer' in renderer)
			?.musicShelfRenderer
			.contents
			.at(0)
			?.musicResponsiveListItemRenderer
			.navigationEndpoint
			.browseEndpoint
			.browseId;

		if (!id) {
			throw new ProviderError(
				this.provider.name,
				`Failed to lookup GTIN '${this.lookup.value}'`,
			);
		}

		return {
			type: BROWSE,
			id,
		};
	}

	async fetchAlbum(albumId: string) {
		const { content, timestamp } = await this.provider.browse<Album>(albumId)
			.catch((reason) => {
				throw new ProviderError(
					this.provider.name,
					`Failed to fetch album '${albumId}': ${reason}`,
				);
			});

		this.updateCacheTime(timestamp);

		return content;
	}

	async fetchPlaylist(playlistId: string) {
		const { content, timestamp } = await this.provider.browse<Playlist>(`VL${playlistId}`)
			.catch((reason) => {
				throw new ProviderError(
					this.provider.name,
					`Failed to fetch playlist '${playlistId}': ${reason}`,
				);
			});

		this.updateCacheTime(timestamp);

		return content;
	}

	async playlistFromAlbum(album: Album) {
		const { id } = this.provider.extractEntityFromUrl(
			new URL(album.microformat.microformatDataRenderer.urlCanonical),
		)!;

		return await this.fetchPlaylist(id);
	}

	async albumFromPlaylist(playlistId: string) {
		// cbrd=1 seems to skip the privacy consent screen
		const { content, timestamp } = await this.provider.extractEmbeddedJson(
			new URL(`https://music.youtube.com/playlist?list=${playlistId}&cbrd=1`),
		);

		this.updateCacheTime(timestamp);

		const endpoint = JSON.parse(content.INITIAL_ENDPOINT) as BrowseEndpoint;

		if (
			endpoint
				.browseEndpoint
				.browseEndpointContextSupportedConfigs
				.browseEndpointContextMusicConfig
				.pageType !==
				'MUSIC_PAGE_TYPE_ALBUM'
		) {
			throw new ProviderError(this.provider.name, `Playlist ${playlistId} is not an album`);
		}

		return await this.fetchAlbum(endpoint.browseEndpoint.browseId);
	}

	protected override convertRawRelease({ album, playlist }: YouTubeMusicRelease) {
		if (!this.entity) {
			this.entity = this.provider.extractEntityFromUrl(
				new URL(album.microformat.microformatDataRenderer.urlCanonical),
			);
		}

		const header = album
			.contents
			?.twoColumnBrowseResultsRenderer
			.tabs
			.at(0)
			?.tabRenderer
			.content
			.sectionListRenderer
			.contents
			.find((renderer) => 'musicResponsiveHeaderRenderer' in renderer)
			?.musicResponsiveHeaderRenderer;

		if (!header) {
			throw new ProviderError(this.provider.name, 'Album response does not contain a header');
		}

		const title = header.title.runs.map((r) => r.text).join('');

		const artists = this.extractArtistCredit(header.straplineTextOne.runs);

		const albumTrackData = album
			.contents
			?.twoColumnBrowseResultsRenderer
			.secondaryContents
			.sectionListRenderer
			.contents
			.find((renderer) => 'musicShelfRenderer' in renderer)
			?.musicShelfRenderer
			.contents
			.map((item) => this.extractTrackData(item));

		const playlistTrackData = playlist
			.contents
			?.twoColumnBrowseResultsRenderer
			.secondaryContents
			.sectionListRenderer
			.contents
			.find((renderer) => 'musicPlaylistShelfRenderer' in renderer)
			?.musicPlaylistShelfRenderer
			.contents
			.map((item) => this.extractTrackData(item));

		if (!albumTrackData || !playlistTrackData || (albumTrackData.length !== playlistTrackData.length)) {
			throw new ProviderError(this.provider.name, 'Corresponding playlist and album contents have different lengths');
		}
		const tracklist: HarmonyTrack[] = Array.from(
			{ length: albumTrackData.length },
			(_, i) => {
				const albumTrack = albumTrackData[i];
				const playlistTrack = playlistTrackData[i];
				const title = albumTrack.title;
				const artists = albumTrack.artists ?? playlistTrack.artists;
				const number = albumTrack.index ?? playlistTrack.index;
				const length = albumTrack.length ?? playlistTrack.length;
				const externalIds = this.provider.makeExternalIds(
					...new Set([albumTrack.videoId, playlistTrack.videoId].filter(isDefined).map((id) => ({ id, type: WATCH }))),
				);
				return {
					title,
					artists,
					number,
					recording: { externalIds },
					length,
				};
			},
		);

		const release: HarmonyRelease = {
			title,
			artists,
			externalLinks: [
				{
					// Album URL is always of type https://music.youtube.com/playlist?list=:playlist_id
					url: album.microformat.microformatDataRenderer.urlCanonical,
					// Set free streaming if every track is (seemingly) streamable
					types: tracklist.every((track) => track.recording?.externalIds?.length) ? ['free streaming'] : undefined,
				},
			],
			media: [
				{
					format: 'Digital Media',
					tracklist,
				},
			],
			packaging: 'None',
			info: this.generateReleaseInfo(),
		};

		const image = album
			.background
			?.musicThumbnailRenderer
			.thumbnail
			.thumbnails
			.sort((a, b) => a.width * a.height - b.width * b.height)
			.at(-1);
		if (image) {
			release.images = [{ url: image.url, types: ['front'] }];
		}

		// Subtitle seems to be of format [releaseType, "•", releaseYear]
		const subtitleRuns = header.subtitle.runs;
		if (subtitleRuns?.length === 3) {
			const albumType = subtitleRuns[0].text;
			if (albumType in primaryTypeIds) {
				release.types = [albumType as ReleaseGroupType];
			}

			let releaseYear: number | undefined;
			try {
				releaseYear = Number.parseInt(
					subtitleRuns[2].text,
				);
			} catch {
				// Leave releaseYear undefined
			}
			release.releaseDate = { year: releaseYear };
		}

		return release;
	}

	extractArtistCredit(runs: TextRun[]): ArtistCreditName[] {
		// If there is only a single text run, return it as artist (even if there is no endpoint)
		if (runs.length === 1) {
			const run = runs[0];
			return [{
				name: run.text,
				externalIds: (run.navigationEndpoint && 'browseEndpoint' in run.navigationEndpoint)
					? this.provider.makeExternalIds({ id: run.navigationEndpoint.browseEndpoint.browseId, type: CHANNEL })
					: undefined,
			}];
		}

		return runs.reduce(
			(artists: ArtistCreditName[], run) => {
				// Text is divided into "runs" of links and normal text.
				// Usually, links point to artists and normal text acts as join phrases

				if (run.navigationEndpoint && 'browseEndpoint' in run.navigationEndpoint) {
					// Current run is artist credit, so append info to list of existing artist credits
					artists.push(
						{
							name: run.text,
							externalIds: this.provider.makeExternalIds({
								id: run.navigationEndpoint.browseEndpoint.browseId,
								type: CHANNEL,
							}),
						},
					);
				} else {
					// Current run is join phrase, so set text as join phrase of previous artist
					const lastArtistCredit = artists.at(-1);
					if (lastArtistCredit) {
						lastArtistCredit.joinPhrase = (lastArtistCredit.joinPhrase ?? '') + run.text;
					}
				}

				return artists;
			},
			[],
		);
	}

	extractTrackData(item: Renderer<'MusicResponsiveListItem'>) {
		const columns = item.musicResponsiveListItemRenderer.flexColumns.map(
			(column) => column.musicResponsiveListItemFlexColumnRenderer.text.runs,
		);

		item.musicResponsiveListItemRenderer;
		const titleRun = columns[0][0];
		const title = titleRun.text;

		let videoId: string | undefined;
		let musicVideoType: string | undefined;
		if (titleRun.navigationEndpoint && 'watchEndpoint' in titleRun.navigationEndpoint) {
			videoId = titleRun.navigationEndpoint.watchEndpoint.videoId;
			musicVideoType = titleRun.navigationEndpoint.watchEndpoint?.watchEndpointMusicSupportedConfigs?.musicVideoType;
		}

		const artistRuns = columns[1];
		const artists = artistRuns ? this.extractArtistCredit(artistRuns) : undefined;

		const albumRun = columns.at(2)?.at(0);
		let albumName: string | undefined;
		let albumId: string | undefined;
		if (albumRun) {
			albumName = albumRun.text;
			albumId = (albumRun.navigationEndpoint && 'browseEndpoint' in albumRun.navigationEndpoint)
				? albumRun.navigationEndpoint.browseEndpoint.browseId
				: undefined;
		}

		const index = item.musicResponsiveListItemRenderer.index?.runs.at(0)?.text;

		const durationString = item.musicResponsiveListItemRenderer.fixedColumns?.at(0)
			?.musicResponsiveListItemFixedColumnRenderer.text.runs
			.map((r) => r.text)
			.join('');

		const duration = durationString?.split(':').reduce((acc, curr) => {
			try {
				return acc * 60 + Number.parseInt(curr);
			} catch (e) {
				throw new ProviderError(this.provider.name, `Failed to parse duration '${durationString}': ${e}`);
			}
		}, 0);

		// TODO: WIP code for fetching data from the "View song credits" popup
		// Can be used to improve artist credits,
		// and to get the videoId of the actual song (instead of the MV) instead of parsing it from the playlist contents
		const creditsEndpoint = item
			.musicResponsiveListItemRenderer
			.menu
			.menuRenderer
			.items
			.filter((renderer) => 'menuNavigationItemRenderer' in renderer)
			?.map((renderer) => renderer.menuNavigationItemRenderer.navigationEndpoint)
			.filter((endpoint) => 'browseEndpoint' in endpoint)
			.find((endpoint) => endpoint.browseEndpoint.browseId.startsWith('MPTC'))
			?.browseEndpoint;

		if (creditsEndpoint) {
			// await this.provider.browse(creditsEndpoint.browseId);
		}

		return {
			title,
			videoId,
			musicVideoType,
			artists,
			albumName,
			albumId,
			index,
			length: duration ? duration * 1000 : undefined,
		};
	}
}
