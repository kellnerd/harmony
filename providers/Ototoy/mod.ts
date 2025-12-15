import type { AlbumMeta, Artist, Label as RawLabel, PackagePage, Track } from './json_types.ts';
import type {
	ArtistCreditName,
	Artwork,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label,
	LinkType,
} from '@/harmonizer/types.ts';
import { type CacheEntry, MetadataProvider, ReleaseLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseISODateTime, PartialDate } from '@/utils/date.ts';
import { ProviderError, ResponseError } from '@/utils/errors.ts';
import { DOMParser, HTMLDocument } from '@b-fuze/deno-dom';
import { parseDuration } from '../../utils/time.ts';

export default class OtotoyProvider extends MetadataProvider {
	readonly name = 'OTOTOY';

	readonly supportedUrls = new URLPattern({
		hostname: 'ototoy.jp',
		pathname: '/_/default/:type(a|p)/:id(\\d+)',
	});

	readonly origin = `https://${this.supportedUrls.hostname}`;

	readonly labelUrlPattern = new URLPattern({
		hostname: this.supportedUrls.hostname,
		pathname: '/labels/:id',
	});

	override readonly features: FeatureQualityMap = {
		// Seems to between 1500-3000, with 1500 being most common
		'cover size': 1500,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.PRESENT,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		release: 'package',
		label: 'label',
	};

	override readonly launchDate: PartialDate = {
		year: 2004,
		month: 8,
	};

	readonly releaseLookup = OtotoyReleaseLookup;

	override extractEntityFromUrl(url: URL): EntityId | undefined {
		const packageResult = this.supportedUrls.exec(url);
		if (packageResult) {
			const type = packageResult.pathname.groups.type!;
			const id = packageResult.pathname.groups.id!;
			if (type == 'a') {
				return {
					type: 'artist',
					id,
				};
			}

			if (type == 'p') {
				return {
					type: 'package',
					id,
				};
			}
		}

		const labelResult = this.labelUrlPattern.exec(url);
		if (labelResult) {
			return {
				type: 'label',
				id: labelResult.pathname.groups.id!,
			};
		}
	}

	constructUrl(entity: EntityId): URL {
		switch (entity.type) {
			case 'artist': {
				return new URL(`https://ototoy.jp/_/default/a/${entity.id}`);
			}
			case 'package': {
				return new URL(`https://ototoy.jp/_/default/p/${entity.id}`);
			}
			case 'label': {
				return new URL(`https://ototoy.jp/labels/${entity.id}`);
			}
		}

		throw new ProviderError(this.name, `Unable to determine type of entity ID '${entity.id}'`);
	}

	override getLinkTypesForEntity(_entity: EntityId): LinkType[] {
		return ['paid download'];
	}

	scrapePackage(html: string, webUrl: URL): PackagePage {
		const doc = new DOMParser().parseFromString(html, 'text/html');
		if (!doc) {
			throw new ResponseError(this.name, `Failed to parse HTML`, webUrl);
		}

		const thumbUrl = this.parseAlbumArtwork(doc);
		if (!thumbUrl) {
			throw new ResponseError(this.name, `Failed to extract album thumbnail`, webUrl);
		}

		const albumMeta = this.parseAlbumMeta(doc);
		if (!albumMeta) {
			throw new ResponseError(this.name, `Failed to extract album metadata`, webUrl);
		}

		const trackList = this.parseTracklist(doc);
		if (!trackList) {
			throw new ResponseError(this.name, `Failed to extract tracklist`, webUrl);
		}

		return {
			thumbUrl,
			albumMeta,
			trackList,
		};
	}

	// The format is as follows:
	//
	// <div class="album-artwork">
	//    <button name="artwork-modal" type="button">
	//       <figure>
	//          <img src="https://imgs.ototoy.jp/..." class="photo">
	//       </figure>
	//    </button>
	// </div>
	//
	// This is just the small thumbnail, the full size image comes from getArtwork()
	parseAlbumArtwork(doc: HTMLDocument): string | undefined {
		const imageElement = doc.querySelector('div.album-artwork img.photo');
		if (!imageElement) return undefined;

		return imageElement.getAttribute('src') || undefined;
	}

	// The format is as follows:
	//
	// <table id="tracklist" class="tracklist">
	//    <tbody>
	//       <tr class="disc-row">
	//          <td colspan="5">DISC 1</td>
	//       </tr>
	//       <tr class="">
	//          <td class="num center">
	//             1
	//          </td>
	//          <td class="item">
	//             <span id="title-123456">Free As A Bird (1995 Mix - Remastered)</span>
	//          </td>
	//          <td class="item center">04:25</td>
	//       </tr>
	//    </tbody>
	// </table>
	//
	// NOTE: `disc-row` is optional
	parseTracklist(doc: HTMLDocument): Track[] | undefined {
		const trackListRows = doc.querySelectorAll('#tracklist tbody tr');

		let currentDisc = undefined;
		const tracks: Track[] = [];

		for (const trackRow of trackListRows) {
			if (trackRow.classList.contains('disc-row')) {
				const match = trackRow.textContent.match(/\d+/);

				if (match) {
					currentDisc = parseInt(match[0], 10);
				}

				continue;
			}

			const trackNumberCell = trackRow.querySelector('.num');
			if (!trackNumberCell) continue;

			const trackNumber = trackNumberCell.textContent.trim();

			const titleSpan = trackRow.querySelector("td.item span[id^='title-']");
			if (!titleSpan) return undefined;

			const artists: Artist[] = [];
			const artistsHtml = trackRow.querySelectorAll('td.item a.artist');
			for (const artist of artistsHtml) {
				const path = artist.getAttribute('href');
				if (!path) continue;

				artists.push({
					url: `${this.origin}${path}`,
					name: artist.textContent.trim(),
				});
			}

			const title = titleSpan.textContent.trim();

			const durationCell = trackRow.querySelectorAll('td')[3];
			if (!durationCell) continue;

			const duration = durationCell.textContent.trim();

			tracks.push({
				title: title,
				artists: artists.length > 0 ? artists : undefined,
				discNumber: currentDisc,
				trackNumber: parseInt(trackNumber, 10),
				duration: parseDuration(duration),
			});
		}

		return tracks;
	}

	// The format is as follows:
	//
	// <div class = "album-meta-data">
	//    <h1 class="album-title">Foo album</h1>
	//    <p class="album-artist">
	//       <span class="album-artist">
	//          <a href="/_/default/a/123456">
	//          Bar artist
	//       </span>
	//    </p>
	//    <div class="detail">
	//       <p class="release-day">Release date: 2025-11-24</p>
	//       <p class="release-day">Original release date: 2025-11-24</p>
	//       <p class="label-name">Label: <a href="/labels/246810">Baz label</a></p>
	//       <p class="catalog-id>Catalog number: NKCD-6849</p>
	//    </div>
	// </div>
	//
	// NOTES:
	//
	// * The `label-name` and `catalog-id` are optional
	// * The release can have an "original" release date, a platform release date, or both. "Release date" is the preferred date.
	//   * In the case that only one date is present, sometimes "Original" is used, sometimes not. Whatever's available will
	//     be used.
	parseAlbumMeta(doc: HTMLDocument): AlbumMeta | undefined {
		const albumMetadata = doc.querySelector('div.album-meta-data');
		if (!albumMetadata) return undefined;

		const titleHeading = albumMetadata.querySelector('h1.album-title');
		if (!titleHeading) return undefined;

		const title = titleHeading.textContent.trim();

		const artistSpans = Array.from(albumMetadata.querySelectorAll('p.album-artist > span.album-artist'));
		if (artistSpans.length === 0) return undefined;

		const artists: Artist[] = [];
		for (const span of artistSpans) {
			const anchor = span.querySelector('a');
			if (!anchor) return undefined;

			const path = anchor.getAttribute('href');
			if (!path) return undefined;

			const name = span.textContent.trim();

			artists.push({
				name,
				url: `${this.origin}${path}`,
			});
		}

		const details = albumMetadata.querySelector('div.detail');
		if (!details) return undefined;

		let releaseDate: string | undefined;
		let originalReleaseDate: string | undefined;

		const releaseElements = details.querySelectorAll('p.release-day');

		releaseElements.forEach((el) => {
			const text = el.textContent.trim();
			if (text.startsWith('Original release date:')) {
				originalReleaseDate = text.replace('Original release date:', '').trim();
			} else if (text.startsWith('Release date:')) {
				releaseDate = text.replace('Release date:', '').trim();
			}
		});

		releaseDate = releaseDate || originalReleaseDate;
		if (!releaseDate) return undefined;

		const albumMeta: AlbumMeta = {
			title,
			artists,
			releaseDate,
		};

		const labelAnchor = details.querySelector('p.label-name > a');
		if (!labelAnchor) return albumMeta;

		const catalogIdParagraph = details.querySelector('p.catalog-id');

		let catalogNumber = undefined;
		if (catalogIdParagraph) {
			catalogNumber = catalogIdParagraph.textContent.trim().match(/^Catalog number: (.*?)$/)?.[1];
		}

		const labelPath = labelAnchor.getAttribute('href');
		if (!labelPath) return undefined;

		const labelName = labelAnchor.textContent.trim();

		albumMeta.label = {
			name: labelName,
			url: `${this.origin}${labelPath}`,
			catalogNumber,
		};

		return albumMeta;
	}

	fetchAndScrapePackagePage(webUrl: URL, maxTimestamp?: number): Promise<CacheEntry<PackagePage>> {
		return this.fetchJSON<PackagePage>(webUrl, {
			policy: { maxTimestamp },
			responseMutator: async (response) => {
				const html = await response.text();

				const parsedPackage = this.scrapePackage(html, webUrl);
				return new Response(JSON.stringify(parsedPackage));
			},
		});
	}
}

export class OtotoyReleaseLookup extends ReleaseLookup<OtotoyProvider, PackagePage> {
	releaseUrl: URL | undefined;

	constructReleaseApiUrl(): URL | undefined {
		return undefined;
	}

	async getRawRelease(): Promise<PackagePage> {
		if (this.lookup.method === 'gtin') {
			throw new ProviderError(this.provider.name, 'GTIN lookups are not supported');
		}

		// Entity is already defined for ID/URL lookups.
		const webUrl = this.provider.constructUrl(this.entity!);
		this.releaseUrl = webUrl;
		const { content: release, timestamp } = await this.provider.fetchAndScrapePackagePage(
			webUrl,
			this.options.snapshotMaxTimestamp,
		);
		this.updateCacheTime(timestamp);

		return release;
	}

	convertRawRelease(albumPage: PackagePage): HarmonyRelease {
		const { albumMeta, trackList } = albumPage;

		const release: HarmonyRelease = {
			title: albumMeta.title,
			artists: albumMeta.artists.map(this.convertRawArtist.bind(this)),
			labels: albumMeta.label ? [this.convertRawLabel(albumMeta.label)] : undefined,
			releaseDate: parseISODateTime(albumMeta.releaseDate),
			media: this.convertRawTracklist(trackList),
			status: 'Official',
			packaging: 'None',
			externalLinks: [{
				url: this.releaseUrl!.href,
				types: ['paid download'],
			}],
			images: [this.getArtwork(albumPage.thumbUrl)],
			info: this.generateReleaseInfo(),
		};

		return release;
	}

	convertRawTracklist(tracklist: Track[]): HarmonyMedium[] {
		const result: HarmonyMedium[] = [];
		let medium: HarmonyMedium = {
			number: 1,
			format: 'Digital Media',
			tracklist: [],
		};

		// split flat tracklist into media
		tracklist.forEach((item) => {
			// store the previous medium and create a new one
			if (item.discNumber && item.discNumber !== medium.number) {
				result.push(medium);

				medium = {
					number: item.discNumber,
					format: 'Digital Media',
					tracklist: [],
				};
			}

			medium.tracklist.push(this.convertRawTrack(item));
		});

		// store the final medium
		result.push(medium);

		return result;
	}

	convertRawTrack(rawTrack: Track): HarmonyTrack {
		const result: HarmonyTrack = {
			number: rawTrack.trackNumber,
			title: rawTrack.title,
			artists: rawTrack.artists?.map(this.convertRawArtist.bind(this)),
			length: rawTrack.duration * 1000,
			type: 'audio',
		};

		return result;
	}

	convertRawArtist(artist: Artist): ArtistCreditName {
		return {
			name: artist.name,
			creditedName: artist.name,
			externalIds: this.provider.makeExternalIdsFromUrl(artist.url),
		};
	}

	convertRawLabel(label: RawLabel): Label {
		return {
			name: label.name,
			catalogNumber: label.catalogNumber,
			externalIds: this.provider.makeExternalIdsFromUrl(label.url),
		};
	}

	getArtwork(thumbUrl: string): Artwork {
		// The artwork will typically be 320x320, for example:
		//
		// https://imgs.ototoy.jp/imgs/jacket/3195/00000003.3195617.1763132761.1492_320.jpg
		//
		// Replacing "_320" at the end with "orig" returns the original, full size image
		//
		// Source: https://github.com/qsniyg/maxurl
		const imageUrl = thumbUrl.replace(/_[0-9]+(\.[^.]+)$/, 'orig$1');

		return {
			url: imageUrl,
			thumbUrl,
			types: ['front'],
		};
	}
}
