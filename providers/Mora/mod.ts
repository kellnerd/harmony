import { ApiArgs, MediaFormat, PackageMeta, Track, WithApiUrl } from './json_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	EntityId,
	HarmonyEntityType,
	HarmonyRelease,
	HarmonyTrack,
	LinkType,
	ReleaseGroupType,
} from '@/harmonizer/types.ts';
import { type CacheEntry, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { extractMetadataTag } from '@/utils/html.ts';
import { isValidGTIN } from '../../utils/gtin.ts';

export default class MoraProvider extends MetadataProvider {
	readonly name = 'Mora';

	readonly supportedUrls = new URLPattern({
		hostname: 'mora.jp',
		pathname: '/package/:labelCode([0-9]+)/:materialNo{/}?',
	});

	readonly artistUrlPattern = new URLPattern({
		hostname: this.supportedUrls.hostname,
		pathname: '/artist/:id{/}?',
	});

	override readonly features: FeatureQualityMap = {
		// The API returns a "full size" image of at most 200x200
		'cover size': 200,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.PRESENT,
		'release label': FeatureQuality.GOOD,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'album',
	};

	override readonly launchDate: PartialDate = {
		year: 2004,
		month: 4,
	};

	readonly releaseLookup = MoraReleaseLookup;

	constructUrl(entity: EntityId): URL {
		if (entity.type === 'artist') {
			return new URL(`https://mora.jp/artist/${entity.id}/`);
		} else if (entity.type === 'album') {
			return new URL(`https://mora.jp/package/${entity.id}/`);
		}

		throw new ProviderError(this.name, `Incomplete release ID '${entity.id}' does not match format \`band/title\``);
	}

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const releaseResult = this.supportedUrls.exec(url);
		if (releaseResult) {
			const { labelCode, materialNo } = releaseResult.pathname.groups;
			if (!labelCode || !materialNo) {
				return undefined;
			}

			return {
				type: 'album',
				id: [labelCode, materialNo].join('/'),
			};
		}

		const artistResult = this.artistUrlPattern.exec(url);
		if (artistResult) {
			return {
				type: 'artist',
				id: artistResult.pathname.groups.id!,
			};
		}

		return undefined;
	}

	override parseProviderId(id: string, entityType: HarmonyEntityType): EntityId {
		return { id, type: this.entityTypeMap[entityType] };
	}

	override getLinkTypesForEntity(_entity: EntityId): LinkType[] {
		return ['paid download'];
	}

	extractEmbeddedJson<Data>(webUrl: URL, maxTimestamp?: number): Promise<CacheEntry<WithApiUrl<Data>>> {
		return this.fetchJSON<ApiArgs>(webUrl, {
			policy: { maxTimestamp },
			responseMutator: async (response) => {
				const html = await response.text();
				const metaTag = extractMetadataTag(html, 'msApplication-Arguments');
				if (!metaTag) {
					throw new ResponseError(this.name, 'Response is missing the expected <meta> tag', webUrl);
				}

				const apiArgsRaw = metaTag.replace(/&quot;/g, '"');
				try {
					const apiArgs: ApiArgs = JSON.parse(apiArgsRaw);

					if (apiArgs) {
						return new Response(JSON.stringify(apiArgs), response);
					}
				} catch (_error) {
					throw new ResponseError(this.name, 'Failed to extract API arguments', webUrl);
				}

				throw new ResponseError(this.name, 'Failed to extract API arguments', webUrl);
			},
		}).then(({ content }) => {
			const apiBase = apiUrl(content.mountPoint, content.labelId, content.materialNo);

			const packageMetaUrl = new URL(apiBase);
			packageMetaUrl.pathname += 'packageMeta.json';

			return this.fetchJSON<WithApiUrl<Data>>(packageMetaUrl, {
				policy: { maxTimestamp },
				responseMutator: async (response) => {
					const data = await response.json();
					return new Response(
						JSON.stringify({
							apiUrl: apiBase,
							data,
						}),
						response,
					);
				},
			});
		});
	}
}

function apiUrl(mountPoint: string, labelId: string, materialNo: string) {
	const paddedMaterialNo = materialNo.padStart(10, '0');
	const slicedMaterialNo = `${paddedMaterialNo.slice(0, 4)}/${paddedMaterialNo.slice(4, 7)}/${
		paddedMaterialNo.slice(7)
	}`;

	return new URL(`https://cf.mora.jp/contents/package/${mountPoint}/${labelId}/${slicedMaterialNo}/`);
}

export class MoraReleaseLookup extends ReleaseLookup<MoraProvider, PackageMeta> {
	rawReleaseUrl: URL | undefined;
	apiUrl: URL | undefined;

	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	async getRawRelease(): Promise<PackageMeta> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		// Entity is already defined for ID/URL lookups.
		const webUrl = this.provider.constructUrl(this.entity!);
		this.rawReleaseUrl = webUrl;
		const { content: release, timestamp } = await this.provider.extractEmbeddedJson<PackageMeta>(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.apiUrl = release.apiUrl;
		this.updateCacheTime(timestamp);

		return release.data;
	}

	convertRawRelease(albumPage: PackageMeta): HarmonyRelease {
		const label = { name: albumPage.labelcompanyname };
		const tracklist = Object.entries(albumPage.trackList).map(([index, track]) =>
			this.convertRawTrack(Number(index), track)
		);
		const types: ReleaseGroupType[] = [Object.keys(albumPage.trackList).length > 1 ? 'Album' : 'Single'];

		// `distPartNo` *might* contain the GTIN, but will oftentimes contain either label-specific catalog numbers, or
		// some package-specific code for mora (e.g. <package number>_F for FLAC releases)
		let gtin = isValidGTIN(albumPage.distPartNo) ? albumPage.distPartNo : undefined;
		if (!gtin) {
			// If we're lucky, the GTIN might be in `cdPartNo`. In testing, the field seems to be `null` most of the time.
			if (albumPage.cdPartNo && isValidGTIN(albumPage.cdPartNo)) {
				gtin = albumPage.cdPartNo;
			} else {
				this.addMessage('Failed to determine GTIN', 'warning');
			}
		}

		const release: HarmonyRelease = {
			title: albumPage.title,
			artists: [this.makeArtistCreditName(albumPage.artistName)],
			labels: [label],
			gtin,
			releaseDate: parseISODateTime(albumPage.startDate),
			availableIn: ['JP'],
			media: [{
				format: 'Digital Media',
				tracklist,
			}],
			status: 'Official',
			packaging: 'None',
			types,
			externalLinks: [{
				url: this.rawReleaseUrl!.href,
				types: ['paid download'],
			}],
			images: [this.getArtwork(albumPage)],
			copyright: albumPage.master,
			info: this.generateReleaseInfo(),
		};

		return release;
	}

	convertRawTrack(index: number, rawTrack: Track): HarmonyTrack {
		return {
			number: index,
			title: rawTrack.title,
			type: rawTrack.mediaFormatNo == MediaFormat.Video ? 'video' : 'audio',
			artists: [this.makeArtistCreditName(rawTrack.artistName)],
			length: rawTrack.duration * 1000,
			recording: {
				externalIds: [],
			},
		};
	}

	makeArtistCreditName(artist: string): ArtistCreditName {
		return {
			name: artist,
			creditedName: artist,
		};
	}

	getArtwork(albumPage: PackageMeta): Artwork {
		const imageUrl = new URL(this.apiUrl!);
		imageUrl.pathname += albumPage.fullsizeimage;

		return {
			url: imageUrl.href,
			types: ['front'],
		};
	}
}
