import type {
	ArtistCreditName,
	CountryCode,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label as HarmonyLabel,
	LinkType,
	MediumFormat,
} from '@/harmonizer/types.ts';
import { ApiQueryOptions, CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { FeatureQualityMap } from '@/providers/features.ts';
import { parseHyphenatedDate } from '@/utils/date.ts';
import { cleanBarcode, uniqueGtinSet } from '@/utils/gtin.ts';
import { isDefined } from '@/utils/predicate.ts';
import { parseDuration } from '@/utils/time.ts';
import type { Artist, Identifier, Label, Release, ReleaseFormat, Track } from './api_types.ts';
import { mediumFormatMap } from './format.ts';
import { countryNameToCode } from './regions.ts';

export default class DiscogsProvider extends MetadataApiProvider {
	readonly name = 'Discogs';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.discogs.com',
		pathname: String.raw`/:locale?/:type(artist|label|release|master)/:id(\d+){-:slug}?`,
	});

	// TODO: Also try to override optional properties which are (or return) empty arrays/objects in the base class.
	override readonly features: FeatureQualityMap = {};

	readonly entityTypeMap = {
		artist: 'artist',
		label: 'label',
		release: 'release',
	};

	readonly releaseLookup = DiscogsReleaseLookup;

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), 'https://www.discogs.com');
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['discography page'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
		});
		return cacheEntry;
	}

	/** Cleans Discogs entity names which have a numeric suffix. */
	cleanName(name: string): string {
		return name.replace(/ \(\d+\)$/, '');
	}
}

export class DiscogsReleaseLookup extends ReleaseApiLookup<DiscogsProvider, Release> {
	constructReleaseApiUrl(): URL {
		return new URL(`releases/${this.lookup.value}`, 'https://api.discogs.com');
	}

	async getRawRelease(): Promise<Release> {
		const apiUrl = this.constructReleaseApiUrl();
		const { content: release, timestamp } = await this.provider.query<Release>(apiUrl, {
			snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
		});
		this.updateCacheTime(timestamp);

		return release;
	}

	convertRawRelease(rawRelease: Release): HarmonyRelease {
		this.entity = {
			type: 'release',
			id: rawRelease.id.toString(),
		};

		return {
			title: rawRelease.title,
			artists: rawRelease.artists.map(this.convertRawArtist.bind(this)),
			gtin: this.findBarcode(rawRelease.identifiers),
			externalLinks: [{
				url: this.provider.constructUrl(this.entity).href,
				types: this.provider.getLinkTypesForEntity(),
			}],
			media: this.convertMedia(rawRelease),
			releaseDate: this.convertReleaseDate(parseHyphenatedDate(rawRelease.released)),
			labels: rawRelease.labels.map(this.convertRawLabel.bind(this)),
			// status: 'Official',
			// types,
			// packaging: 'None',
			releaseGroup: {
				externalIds: this.provider.makeExternalIds({ type: 'master', id: rawRelease.master_id.toString() }),
			},
			images: [],
			availableIn: this.convertCountry(rawRelease.country),
			info: this.generateReleaseInfo(),
		};
	}

	convertMedia(rawRelease: Release): HarmonyMedium[] {
		const mediumFormats = rawRelease.formats.flatMap(this.convertFormat);
		const media: HarmonyMedium[] = mediumFormats.map((format, index) => ({
			number: index + 1,
			format,
			tracklist: [],
		}));

		if (media.length >= 1) {
			// TODO: split flat tracklist into multiple media
			media[0].tracklist = rawRelease.tracklist.map(this.convertRawTrack.bind(this));
		}

		return media;
	}

	convertRawTrack(track: Track): HarmonyTrack {
		return {
			number: track.position,
			title: track.title,
			artists: track.artists.map(this.convertRawArtist.bind(this)),
			length: parseDuration(track.duration) * 1000,
		};
	}

	convertRawArtist(artist: Artist): ArtistCreditName {
		let joinPhrase = artist.join;
		if (joinPhrase) {
			// Discogs join phrases are often not padded with the necessary spaces.
			// Prefix with space unless the phrase starts with a space or a comma.
			if (!/^[\s,]/.test(joinPhrase)) {
				joinPhrase = ' ' + joinPhrase;
			}
			// Append space if it is missing.
			if (!joinPhrase.endsWith(' ')) {
				joinPhrase += ' ';
			}
		}
		return {
			name: this.provider.cleanName(artist.name),
			creditedName: artist.anv || undefined,
			joinPhrase: joinPhrase || undefined,
			externalIds: this.provider.makeExternalIds({
				type: 'artist',
				id: artist.id.toString(),
			}),
		};
	}

	convertRawLabel(label: Label): HarmonyLabel {
		return {
			name: this.provider.cleanName(label.name),
			catalogNumber: label.catno || undefined,
			externalIds: this.provider.makeExternalIds({
				type: 'label',
				id: label.id.toString(),
			}),
		};
	}

	convertCountry(countryName: string): CountryCode[] | undefined {
		// TODO: handle groups of multiple countries and historical regions
		const countryCode = countryNameToCode[countryName];
		if (countryCode) {
			return [countryCode];
		} else {
			this.addMessage(`Unknown country '${countryName}' was ignored`, 'warning');
		}
	}

	convertFormat(format: ReleaseFormat): Array<MediumFormat | undefined> {
		const mediumFormat = mediumFormatMap[format.name];
		const quantity = Number.parseInt(format.qty, 10);
		return new Array(quantity).fill(mediumFormat);
	}

	findBarcode(identifiers: Identifier[]): string | undefined {
		const barcodes = identifiers.filter((identifier) => identifier.type === 'Barcode');
		if (!barcodes.length) {
			return;
		}
		const gtinCandidates = barcodes.map((barcode) => cleanBarcode(barcode.value)).filter(isDefined);
		const uniqueGtins = uniqueGtinSet(gtinCandidates);
		if (uniqueGtins.size > 1) {
			this.addMessage(
				`Release has multiple barcodes: ${barcodes.map((barcode) => barcode.value).join(', ')}`,
				'warning',
			);
		}
		return gtinCandidates[0];
	}
}
