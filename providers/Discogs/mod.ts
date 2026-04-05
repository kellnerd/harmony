import type {
	ArtistCreditName,
	CountryCode,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label as HarmonyLabel,
	LinkType,
} from '@/harmonizer/types.ts';
import { ApiQueryOptions, CacheEntry, MetadataApiProvider, ReleaseApiLookup } from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { parseHyphenatedDate } from '@/utils/date.ts';
import { cleanBarcode, uniqueGtinSet } from '@/utils/gtin.ts';
import { pluralWithCount } from '@/utils/plural.ts';
import { isDefined } from '@/utils/predicate.ts';
import { parseDuration } from '@/utils/time.ts';
import type { Artist, Identifier, Label, Release, Track } from './api_types.ts';
import { convertFormat, extractMoreDetailsFromFormats } from './format.ts';
import { convertCountryStringToCodes } from './regions.ts';
import { combineTracklistSectionsToMedia, splitTracklistIntoSections, type TracklistSection } from './tracklist.ts';

export default class DiscogsProvider extends MetadataApiProvider {
	readonly name = 'Discogs';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.discogs.com',
		pathname: String.raw`/:locale?/:type(artist|label|release|master)/:id(\d+){-:slug}?`,
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 600,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.MISSING,
		'MBID resolving': FeatureQuality.GOOD,
		'release label': FeatureQuality.GOOD,
	};

	readonly entityTypeMap = {
		artist: 'artist',
		label: 'label',
		release: 'release',
		'release-group': 'master',
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
			...extractMoreDetailsFromFormats(rawRelease.formats),
			releaseGroup: rawRelease.master_id
				? {
					externalIds: this.provider.makeExternalIds({ type: 'master', id: rawRelease.master_id.toString() }),
				}
				: undefined,
			images: [],
			availableIn: rawRelease.country ? this.convertCountry(rawRelease.country) : undefined,
			info: this.generateReleaseInfo(),
		};
	}

	convertMedia(rawRelease: Release): HarmonyMedium[] {
		const mediumFormats = rawRelease.formats.flatMap(convertFormat);
		const tracklistSections = splitTracklistIntoSections(rawRelease.tracklist);
		const rawMedia = combineTracklistSectionsToMedia(tracklistSections);
		const hasBrokenTracklist = rawMedia.length !== mediumFormats.length;

		if (hasBrokenTracklist) {
			this.addMessage(
				`Tracklist could not be split into ${
					pluralWithCount(mediumFormats.length, 'medium', 'media')
				} as expected, found ${pluralWithCount(rawMedia.length, 'medium', 'media')}`,
				'error',
			);
		}

		return rawMedia.map((rawMedium, index) => ({
			number: index + 1,
			format: hasBrokenTracklist ? undefined : mediumFormats[index],
			title: rawMedium.title,
			tracklist: rawMedium.sections.flatMap((section) =>
				section.tracks.map((track) => this.convertRawTrack(track, section))
			),
		}));
	}

	convertRawTrack(track: Track, section?: TracklistSection): HarmonyTrack {
		let trackNumber = track.position;
		if (section?.hasMediumPrefix && section.positionPrefix) {
			trackNumber = trackNumber.replace(section.positionPrefix, '');
		}

		let trackTitle = track.title;
		if (section?.heading && section.type === 'track group') {
			trackTitle = `${section.heading}: ${trackTitle}`;
		}

		return {
			number: trackNumber,
			title: trackTitle,
			artists: track.artists?.map(this.convertRawArtist.bind(this)),
			length: track.duration ? parseDuration(track.duration) * 1000 : undefined,
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
		let catalogNumber = label.catno;
		if (catalogNumber === 'none') {
			catalogNumber = '[none]';
		}

		return {
			name: this.provider.cleanName(label.name),
			catalogNumber: catalogNumber || undefined,
			externalIds: this.provider.makeExternalIds({
				type: 'label',
				id: label.id.toString(),
			}),
		};
	}

	convertCountry(countryName: string): CountryCode[] | undefined {
		const countryCodes = convertCountryStringToCodes(countryName);
		if (countryCodes) {
			return countryCodes;
		} else {
			this.addMessage(`Unknown country '${countryName}' was ignored`, 'warning');
		}
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
