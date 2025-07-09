import { MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, type FeatureQualityMap } from '@/providers/features.ts';
import { ProviderError } from '@/utils/errors.ts';
import type {
	ArtistCreditName,
	EntityId,
	HarmonyEntityType,
	HarmonyRelease,
	HarmonyTrack,
	LinkType,
	ReleaseOptions,
	ReleaseSpecifier,
} from '@/harmonizer/types.ts';

import { Innertube, UniversalCache, type YTMusic, YTNodes } from 'youtubei.js';

// See https://ytjs.dev/guide/ and https://ytjs.dev/api/

// Avoid typos when repeating entity types
const CHANNEL = 'channel';
const PLAYLIST = 'playlist';
const BROWSE = 'browse';
const WATCH = 'watch';

export default class YouTubeMusicProvider extends MetadataProvider {
	// Needs asynchronous creation, so is created in first getRelease call
	innertube: Innertube | undefined;

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
	 * - https://music.youtube.com/channel/:channel_id
	 * - https://music.youtube.com/browse/:browse_id
	 * - https://music.youtube.com/playlist?list=:playlist_id
	 * - https://music.youtube.com/watch?v=:watch_id
	 */
	readonly supportedUrls = new URLPattern({
		hostname: 'music.youtube.com',
		pathname: '/:type(playlist|channel|browse|watch)/:id?',
	});

	// Override entity extraction since we also need to also extract id from search
	override extractEntityFromUrl(url: URL) {
		const matched = this.supportedUrls.exec(url);

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

	override getLinkTypesForEntity(): LinkType[] {
		return ['free streaming'];
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
				throw new ProviderError(this.name, `Release id '${id} has invalid prefix, most likely not a valid release'`);
			}
		} else {
			return super.parseProviderId(id, entityType);
		}
	}

	override async getRelease(specifier: ReleaseSpecifier, options: ReleaseOptions = {}): Promise<HarmonyRelease> {
		this.innertube = await Innertube.create({
			cache: new UniversalCache(false),
		});

		return await super.getRelease(specifier, options);
	}
}

export class YouTubeMusicReleaseLookup extends ReleaseLookup<YouTubeMusicProvider, YTMusic.Album> {
	override constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	protected override async getRawRelease(): Promise<YTMusic.Album> {
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
			const playlist = await this.provider.innertube!.music
				.getPlaylist(id)
				.catch((reason) => {
					throw new ProviderError(
						this.provider.name,
						`Failed to fetch playlist '${albumId}': ${reason}`,
					);
				});

			const trackAlbum = playlist.contents
				?.as(YTNodes.MusicResponsiveListItem)
				.at(0)?.album;
			if (!trackAlbum?.id) {
				throw new ProviderError(
					this.provider.name,
					`Failed to convert playlist '${id}' to album`,
				);
			}
			albumId = trackAlbum.id;
		}

		// Convert album id to album
		const album = await this.provider.innertube!.music
			.getAlbum(albumId)
			.catch((reason) => {
				throw new ProviderError(
					this.provider.name,
					`Failed to fetch album '${albumId}': ${reason}`,
				);
			});

		// If type was playlist, assert that the playlist url of the converted album is indeed the original playlist
		if (
			type === PLAYLIST &&
			this.provider.extractEntityFromUrl(new URL(album.url!))?.id !== id
		) {
			throw new ProviderError(
				this.provider.name,
				`Failed to convert playlist '${id}' to album`,
			);
		}

		return album;
	}

	private async lookupGTIN(): Promise<EntityId> {
		// When searching YouTube Music for a GTIN in quotes, the first (and only) search result always seems to be the album with that GTIN
		// If there is no album with that GTIN on YouTube, this should just return undefined
		const id = (
			await this.provider.innertube!.music.search(`"${this.lookup.value}"`, {
				type: 'album',
			}).catch((reason) => {
				throw new ProviderError(
					this.provider.name,
					`Failed to lookup GTIN '${this.lookup.value}': ${reason}`,
				);
			})
		).albums?.contents.at(0)?.id;

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

	protected override convertRawRelease(rawRelease: YTMusic.Album) {
		if (!this.entity) {
			this.entity = this.provider.extractEntityFromUrl(
				new URL(rawRelease.url!),
			);
		}

		// YouTube always seems to return a MusicResponsiveHeader.
		// Throw if this isn't the case, as all other header types don't seem to contain helpful data anyways
		if (!(rawRelease.header instanceof YTNodes.MusicResponsiveHeader)) {
			throw new ProviderError(
				this.provider.name,
				'Got bad header type from API',
			);
		}

		const title = rawRelease.header.title.text;
		if (!title) {
			throw new ProviderError(this.provider.name, 'Release has no title');
		}

		const artists = rawRelease.header.strapline_text_one.runs?.reduce(
			(artists: ArtistCreditName[], run) => {
				// Text is divided into "runs" of links and normal text.
				// Usually, links point to artists and normal text acts as join phrases

				if ('endpoint' in run && run.endpoint) {
					// Current run is artist credit, so append info to list of existing artist credits
					artists.push(
						{
							name: run.text,
							externalIds: [
								{
									provider: this.provider.internalName,
									type: CHANNEL,
									id: run.endpoint.payload.browseId,
								},
							],
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

		const tracklist = rawRelease.contents.map((item) => this.convertTrack(item));

		const release: HarmonyRelease = {
			title,
			artists: artists ?? [],
			externalLinks: [
				{
					// rawRelease.url is always of type https://music.youtube.com/playlist?list=:playlist_id
					url: rawRelease.url!,
					types: this.provider.getLinkTypesForEntity(),
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

		return release;
	}

	convertTrack(item: YTNodes.MusicResponsiveListItem): HarmonyTrack {
		const videoId = item.overlay?.content?.endpoint.payload.videoId;

		let length: number | undefined;
		if (item.duration) {
			length = item.duration.seconds * 1000;
		}

		return {
			title: item.title!,
			type: 'audio',
			recording: {
				externalIds: [{
					type: WATCH,
					id: videoId,
					provider: this.provider.internalName,
				}],
			},
			length,
			number: item.index?.text,
		};
	}
}
