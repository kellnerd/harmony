import type {
	ArtistCreditName,
	Artwork,
	CountryCode,
	EntityId,
	HarmonyMedium,
	HarmonyRelease,
	HarmonyTrack,
	Label as HarmonyLabel,
	LinkType,
} from '@/harmonizer/types.ts';
import {
	ApiQueryOptions,
	CacheEntry,
	MetadataApiProvider,
	ProviderOptions,
	ReleaseApiLookup,
} from '@/providers/base.ts';
import { DurationPrecision, FeatureQuality, FeatureQualityMap } from '@/providers/features.ts';
import { getFromEnv } from '@/utils/config.ts';
import { parseHyphenatedDate } from '@/utils/date.ts';
import { ResponseError } from '@/utils/errors.ts';
import { cleanBarcode, uniqueGtinSet } from '@/utils/gtin.ts';
import { pluralWithCount } from '@/utils/plural.ts';
import { isDefined } from '@/utils/predicate.ts';
import { parseDuration } from '@/utils/time.ts';
import type {
	ApiError,
	Artist,
	Identifier,
	Image,
	Label,
	Release,
	ReleaseResult,
	SearchResults,
	Track,
} from './api_types.ts';
import { convertFormat, extractMoreDetailsFromFormatsAndStyles } from './format.ts';
import { convertCountryStringToCodes } from './regions.ts';
import { combineTracklistSectionsToMedia, splitTracklistIntoSections, type TracklistSection } from './tracklist.ts';

const discogsKey = getFromEnv('HARMONY_DISCOGS_CONSUMER_KEY');
const discogsSecret = getFromEnv('HARMONY_DISCOGS_CONSUMER_SECRET');

export default class DiscogsProvider extends MetadataApiProvider {
	constructor(options: ProviderOptions = {}) {
		const isAuthenticated = Boolean(discogsKey && discogsSecret);

		super({
			rateLimitInterval: 60_000,
			// TODO: For some reason X-Discogs-Ratelimit is always 25, even when I am authenticated and it should be 60...
			// concurrentRequests: isAuthenticated ? 60 : 25,
			concurrentRequests: 25,
			...options,
		});

		let userAgent = 'Harmony';
		if (options.appInfo) {
			const { name, version, contact } = options.appInfo;
			userAgent = `${name}/${version}`;
			if (contact) {
				userAgent += ` +${contact}`;
			}
		}

		this.requestHeaders = new Headers({
			'User-Agent': userAgent,
		});
		if (isAuthenticated) {
			this.requestHeaders.set('Authentication', `Discogs key=${discogsKey}, secret=${discogsSecret}`);
		}
	}

	readonly name = 'Discogs';

	readonly supportedUrls = new URLPattern({
		hostname: 'www.discogs.com',
		pathname: String.raw`/:locale?/:type(artist|label|release|master)/:id(\d+){-:slug}?`,
	});

	override readonly features: FeatureQualityMap = {
		'cover size': 600,
		'duration precision': DurationPrecision.SECONDS,
		'GTIN lookup': FeatureQuality.GOOD,
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

	readonly baseUrl = 'https://www.discogs.com';

	constructUrl(entity: EntityId): URL {
		return new URL([entity.type, entity.id].join('/'), this.baseUrl);
	}

	override getLinkTypesForEntity(): LinkType[] {
		return ['discography page'];
	}

	async query<Data>(apiUrl: URL, options: ApiQueryOptions): Promise<CacheEntry<Data>> {
		const cacheEntry = await this.fetchJSON<Data>(apiUrl, {
			policy: { maxTimestamp: options.snapshotMaxTimestamp },
			requestInit: {
				headers: this.requestHeaders,
			},
		});
		const apiError = cacheEntry.content as ApiError;
		if (apiError.message) {
			throw new ResponseError(this.name, apiError.message, apiUrl);
		}
		return cacheEntry;
	}

	/** Cleans Discogs entity names which have a numeric suffix. */
	cleanName(name: string): string {
		return name.replace(/ \(\d+\)$/, '');
	}

	private requestHeaders: Headers;
}

export class DiscogsReleaseLookup extends ReleaseApiLookup<DiscogsProvider, Release> {
	constructReleaseApiUrl(): URL {
		const apiBaseUrl = 'https://api.discogs.com';
		switch (this.lookup.method) {
			case 'id':
				return new URL(`releases/${this.lookup.value}`, apiBaseUrl);
			case 'gtin': {
				const searchUrl = new URL('database/search', apiBaseUrl);
				searchUrl.searchParams.set('type', 'release');
				searchUrl.searchParams.set('barcode', this.lookup.value);
				return searchUrl;
			}
		}
	}

	async getRawRelease(): Promise<Release> {
		if (this.lookup.method !== 'id') {
			const apiUrl = this.constructReleaseApiUrl();
			const { content, timestamp } = await this.provider.query<SearchResults<ReleaseResult>>(apiUrl, {
				snapshotMaxTimestamp: this.options.snapshotMaxTimestamp,
			});
			this.updateCacheTime(timestamp);

			const releaseResults = content.results;
			if (releaseResults.length) {
				// Lookup again by ID to get release details.
				this.lookup = {
					method: 'id',
					value: releaseResults[0].id.toString(),
				};
				if (releaseResults.length > 1) {
					this.warnMultipleResults(
						releaseResults.slice(1).map((result) => new URL(result.resource_url, this.provider.baseUrl)),
					);
				}
			} else {
				throw new ResponseError(this.provider.name, 'API returned no results', apiUrl);
			}
		}
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
			releaseDate: rawRelease.released ? this.convertReleaseDate(parseHyphenatedDate(rawRelease.released)) : undefined,
			labels: rawRelease.labels.map(this.convertRawLabel.bind(this)),
			...extractMoreDetailsFromFormatsAndStyles(rawRelease.formats, rawRelease.styles),
			releaseGroup: rawRelease.master_id
				? {
					externalIds: this.provider.makeExternalIds({ type: 'master', id: rawRelease.master_id.toString() }),
				}
				: undefined,
			images: rawRelease.images.map(this.convertImage),
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

	convertImage(image: Image): Artwork {
		return {
			url: image.uri,
			// thumbUrl: image.uri150, // JPEG Q40 is too blurry
			types: image.type === 'primary' ? ['front'] : undefined,
		};
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
