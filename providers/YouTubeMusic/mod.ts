import { MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { ProviderError } from '@/utils/errors.ts';
import type {
	ArtistCreditName,
	EntityId,
	HarmonyEntityType,
	HarmonyRelease,
	HarmonyTrack,
	LinkType,
} from '@/harmonizer/types.ts';

import { Innertube, YTMusic, YTNodes } from 'youtubei.js';

// See https://ytjs.dev/guide/ and https://ytjs.dev/api/

// Avoid typos when repeating entity types
const CHANNEL = 'channel';
const PLAYLIST = 'playlist';
const ALBUM = 'album';
const TRACK = 'track';

export default class YoutubeMusicProvider extends MetadataProvider {
	override entityTypeMap: Record<HarmonyEntityType, string | string[]> = {
		artist: CHANNEL,
		release: [PLAYLIST, ALBUM],
	};

	override readonly features: FeatureQualityMap = {
		'MBID resolving': FeatureQuality.GOOD,
		'GTIN lookup': FeatureQuality.GOOD,
		'duration precision': DurationPrecision.SECONDS,
	};

	protected override releaseLookup = YoutubeMusicReleaseLookup;

	override readonly name = 'Youtube Music';

	/**
	 * Accepts:
	 * - https://music.youtube.com/channel/:channel_id
	 * - https://music.youtube.com/browse/:album_id
	 * - https://music.youtube.com/playlist?list=:playlist_id
	 */
	override readonly supportedUrls = new URLPattern({
		hostname: 'music.youtube.com',
		pathname: '/:type(playlist|channel|browse)/:id?',
		search: '{list=:id}?',
	});

	override getLinkTypesForEntity(): LinkType[] {
		return ['free streaming'];
	}

	// Override entity extraction since we also need to also extract groups from search
	override extractEntityFromUrl(url: URL) {
		const matched = this.supportedUrls.exec(url);
		if (matched) {
			const { type } = matched.pathname.groups;
			const id = matched.pathname.groups['id'] ?? matched.search.groups['id'];
			if (type && id) {
				return {
					type: (type === 'browse' ? ALBUM : type),
					id,
				};
			}
		}
	}

	override constructUrl(entity: EntityId): URL {
		return new URL(
			(entity.type === PLAYLIST)
				? `playlist?list=${entity.id}`
				: (entity.type === TRACK)
				? `watch?v=${entity.id}`
				: `${entity.type}/${entity.id}`,
			'https://music.youtube.com',
		);
	}

	/** Both playlist and album are a release, distinguish between them */
	override serializeProviderId(entity: EntityId): string {
		return (entity.type === PLAYLIST || entity.type === ALBUM) ? `${entity.type}:${entity.id}` : entity.id;
	}

	override parseProviderId(id: string, entityType: HarmonyEntityType): EntityId {
		if (entityType === 'release') {
			// Split at first ':', collect rest of items into array to join later in case id contained additional ':'
			const [type, ...splitId] = id.split(':');
			return {
				type,
				id: splitId.join(':'),
			};
		} else {
			return {
				type: 'artist',
				id,
			};
		}
	}
}

export class YoutubeMusicReleaseLookup extends ReleaseLookup<YoutubeMusicProvider, YTMusic.Album> {
	// Needs asynchronous creation, so is created in first getRawRelease call
	innertube: Innertube | undefined;

	override constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	protected override async getRawRelease(): Promise<YTMusic.Album> {
		// Innertube needs an async context to be created, so create it in the first async context available
		if (!this.innertube) {
			this.innertube = await Innertube.create();
		}

		const { type, id } = (this.lookup.method === 'gtin')
			? await this.lookupGTIN()
			: this.provider.parseProviderId(this.lookup.value, 'release');

		let albumId = id;

		// Try to convert playlist to album by getting the album of the first track
		// Reasoning:
		// If the playlist is an album, the first track of the playlist is the first track of the corresponding album.
		// If the first track does indeed have an album, we can check that album's playlist url.
		// If that playlist url is the same as the current playlist url, we are indeed in the album we found.
		if (type === PLAYLIST) {
			const playlist = await this.innertube.music.getPlaylist(id).catch((reason) => {
				throw new ProviderError(this.provider.name, `Failed to fetch playlist '${albumId}': ${reason}`);
			});
			const trackAlbum = playlist.contents?.as(YTNodes.MusicResponsiveListItem).at(0)?.album;
			if (!trackAlbum?.id) {
				throw new ProviderError(this.provider.name, `Failed to convert playlist '${id}' to album`);
			}
			albumId = trackAlbum.id;
		}

		// Convert album id to album
		const album = await this.innertube.music.getAlbum(albumId).catch((reason) => {
			throw new ProviderError(this.provider.name, `Failed to fetch album '${albumId}': ${reason}`);
		});

		// If type was playlist, assert that the playlist url of the converted album is indeed the original playlist
		if (
			type === PLAYLIST &&
			this.provider.extractEntityFromUrl(new URL(album.url!))?.id !== id
		) {
			throw new ProviderError(this.provider.name, `Failed to convert playlist '${id}' to album`);
		}

		return album;
	}

	private async lookupGTIN(): Promise<EntityId> {
		// When searching YouTube Music for a GTIN in quotes, the first (and only) search result always seems to be the album with that GTIN
		// If there is no album with that GTIN on YouTube, this should just return undefined
		const id = (await this.innertube!.music.search(`"${this.lookup.value}"`, { type: 'album' }).catch((reason) => {
			throw new ProviderError(this.provider.name, `Failed to lookup GTIN '${this.lookup.value}': ${reason}`);
		})).albums?.contents.at(0)?.id;

		if (!id) {
			throw new ProviderError(this.provider.name, `Failed to lookup GTIN '${this.lookup.value}'`);
		}

		return {
			type: ALBUM,
			id,
		};
	}

	protected override async convertRawRelease(rawRelease: YTMusic.Album) {
		if (!this.entity) {
			this.entity = this.provider.extractEntityFromUrl(new URL(rawRelease.url!));
		}

		// Youtube always seems to return a MusicResponsiveHeader.
		// Throw if this isn't the case, as all other header types don't contain helpful data anyways
		if (!(rawRelease.header instanceof YTNodes.MusicResponsiveHeader)) {
			throw new ProviderError(this.provider.name, 'Got bad header type from API');
		}

		const title = rawRelease.header.title.text;
		if (!title) {
			throw new ProviderError(this.provider.name, 'Release has no title');
		}

		const artists = rawRelease.header.strapline_text_one.runs?.reduce((artists: ArtistCreditName[], run) => {
			// Text is divided into "runs" of links and normal text.
			// Usually, links point to artists and normal text acts as join phrases

			if ('endpoint' in run && run.endpoint) {
				// Current run is artist credit, so append info to list of existing artist credits
				return [...artists, {
					name: run.text,
					externalIds: [{
						provider: this.provider.internalName,
						type: CHANNEL,
						id: run.endpoint.payload.browseId,
					}],
				}];
			} else {
				// Current run is join phrase, so set text as join phrase of previous artist
				const lastArtistCredit = artists.at(-1);
				if (lastArtistCredit) {
					lastArtistCredit.joinPhrase = (lastArtistCredit.joinPhrase ?? '') + run.text;
				}
				return artists;
			}
		}, []);

		const tracklist = rawRelease.contents.map((item) => {
			const videoId = item.overlay?.content?.endpoint.payload.videoId;

			let length;
			if (item.duration) {
				length = item.duration.seconds * 1000;
			}

			let number;
			if (item.index?.text) {
				try {
					number = parseInt(item.index.text);
				} catch (_e) {
					// Leave number undefined if parsing failed
				}
			}

			return {
				title: item.title!,
				tracktype: 'audio',
				recording: {
					title: item.title!,
					externalIds: [{
						type: TRACK,
						id: videoId,
						provider: this.provider.internalName,
					}],
				},
				length,
				number,
			} as HarmonyTrack;
		});

		const release: HarmonyRelease = {
			title,
			artists: artists ?? [],
			externalLinks: [{
				// rawRelease.url is always of type https://music.youtube.com/playlist?list=:playlist_id
				url: rawRelease.url!,
				types: this.provider.getLinkTypesForEntity(),
			}],
			media: [{
				format: 'Digital Media',
				tracklist,
			}],
			packaging: 'None',
			info: this.generateReleaseInfo(),
		};

		return release;
	}
}
