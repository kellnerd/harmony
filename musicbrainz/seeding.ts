import { createReleasePermalink, encodeReleaseLookupState } from '@/server/permalink.ts';
import { determineReleaseEventCountries } from './release_countries.ts';
import { urlTypeIds } from './type_id.ts';
import { formatRegionList } from '@/utils/regions.ts';
import { preferArray } from 'utils/array/scalar.js';
import { flatten } from 'utils/object/flatten.js';
import { transform } from 'utils/string/transform.js';

import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import type {
	ArtistCreditNameSeed,
	ArtistCreditSeed,
	MediumSeed,
	ReleaseEventSeed,
	ReleaseLabelSeed,
	ReleaseSeed,
	ReleaseUrlSeed,
	TrackSeed,
} from '@kellnerd/musicbrainz/seeding/release';
import type { ArtistCreditName, HarmonyRelease, LinkType, ReleaseInfo } from '@/harmonizer/types.ts';
import type { FormDataRecord } from 'utils/types.d.ts';

export interface ReleaseSeedOptions {
	/** URL of the project which was used to seed the release, for edit notes. */
	projectUrl: URL;
	/** URL to which MusicBrainz should redirect, permalink query parameters will be set automatically. */
	redirectUrl?: URL;
	/** Base URL of the Harmony instance which was used to seed the release, for permalinks. */
	seederUrl?: URL;
	/** Indicates whether the seed will be used to update an existing release. */
	isUpdate?: boolean;
	/** Options for the annotation builder. */
	annotation?: AnnotationIncludes;
}

/** Information which should be included in the annotation. */
interface AnnotationIncludes {
	/** Include lists of available and excluded regions. */
	availability?: boolean;
	/** Include copyright lines. */
	copyright?: boolean;
	/** Include text-based release credits. */
	textCredits?: boolean;
}

export function createReleaseSeed(release: HarmonyRelease, options: ReleaseSeedOptions): FormDataRecord {
	const countries = preferArray(determineReleaseEventCountries(release));
	const { redirectUrl } = options;

	if (redirectUrl) {
		// Preserve lookup parameters such as the used providers.
		const lookupState = encodeReleaseLookupState(release.info);
		// Timestamp `ts` is not needed and may even lead to cache misses when different lookup options are used.
		lookupState.delete('ts');
		redirectUrl.search = lookupState.toString();
	}

	const externalLinks: ReleaseUrlSeed[] = release.externalLinks.flatMap((link) =>
		link.types?.length
			? link.types.map((type) => ({
				url: link.url,
				link_type: convertLinkType('release', type, new URL(link.url)),
			}))
			: ({
				url: link.url,
			})
	);

	if (options.isUpdate) {
		// Only seed external links for now, updating other properties is more controversial.
		// For some properties (such as the tracklist) seeding updates is even affected by bugs:
		// https://tickets.metabrainz.org/browse/MBS-13688
		const seed: Omit<ReleaseSeed, 'name'> = {
			urls: externalLinks,
			edit_note: buildEditNote(release.info, options),
			redirect_uri: redirectUrl?.href,
		};

		return flatten(seed);
	}

	const seed: ReleaseSeed = {
		name: release.title,
		artist_credit: convertArtistCredit(release.artists),
		release_group: release.releaseGroup?.mbid,
		barcode: release.gtin?.toString(),
		events: countries.map<ReleaseEventSeed>((country) => ({
			date: release.releaseDate,
			country,
		})),
		labels: release.labels?.map<ReleaseLabelSeed>((label) => ({
			name: label.name,
			catalog_number: label.catalogNumber,
			mbid: label.mbid,
		})),
		status: release.status,
		type: release.types,
		packaging: release.packaging,
		mediums: release.media.map<MediumSeed>((medium) => ({
			format: medium.format,
			name: medium.title,
			track: medium.tracklist.map<TrackSeed>((track) => ({
				name: track.title,
				artist_credit: convertArtistCredit(track.artists),
				number: track.number?.toString(),
				length: track.length,
				recording: track.recording?.mbid,
			})),
		})),
		language: release.language?.code,
		script: release.script?.code,
		urls: externalLinks,
		annotation: buildAnnotation(release, options.annotation),
		edit_note: buildEditNote(release.info, options),
		redirect_uri: redirectUrl?.href,
	};

	return flatten(seed);
}

export function convertArtistCredit(artists?: ArtistCreditName[]): ArtistCreditSeed | undefined {
	if (!artists) return;

	const lastIndex = artists.length - 1;
	return {
		names: artists.map<ArtistCreditNameSeed>((artist, index) => {
			const defaultJoinPhrase = (index !== lastIndex) ? (index === lastIndex - 1 ? ' & ' : ', ') : undefined;

			return {
				artist: !artist.mbid ? { name: artist.name } : undefined,
				mbid: artist.mbid,
				name: artist.creditedName,
				join_phrase: artist.joinPhrase ?? defaultJoinPhrase,
			};
		}),
	};
}

export function convertLinkType(entityType: EntityType, linkType: LinkType, url?: URL): number | undefined {
	const typeIds = urlTypeIds[entityType];
	if (!typeIds) return;

	switch (linkType) {
		case 'free streaming':
			return typeIds['free streaming'];
		case 'paid streaming':
			return typeIds.streaming;
		case 'free download':
			return typeIds['download for free'];
		case 'paid download':
			return typeIds['purchase for download'];
		case 'mail order':
			return typeIds['purchase for mail-order'];
		case 'discography page':
			// Handle URLs which MB treats as special cases
			if (url?.hostname.endsWith('.bandcamp.com')) {
				return typeIds.bandcamp;
			}
			return typeIds['discography page'] ?? typeIds['discography entry'];
		case 'license':
			return typeIds['license'];
	}
}

function buildAnnotation(release: HarmonyRelease, include: AnnotationIncludes = {}): string {
	const sections: string[] = [];

	if (include.copyright && release.copyright) {
		sections.push(`Copyright: ${release.copyright}`);
	}
	if (include.textCredits && release.credits) {
		sections.push(`=== Credits from ${release.info.sourceMap?.credits!} ===`, release.credits);
	}
	if (include.availability) {
		const { availableIn, excludedFrom } = release;
		const releaseEventCount = determineReleaseEventCountries(release)?.length;
		// Skip if all available regions have been preserved as release events.
		if (availableIn?.length !== releaseEventCount) {
			// Skip if the list would be the equivalent of one worldwide release event.
			if (availableIn?.length && releaseEventCount !== 1) {
				sections.push('=== Available Regions ===', formatRegionList(availableIn));
			}
			if (excludedFrom?.length) {
				sections.push('=== Excluded Regions ===', formatRegionList(excludedFrom));
			}
		}
	}

	const annotation = sections.join('\n\n');

	// https://musicbrainz.org/doc/Annotation#Wiki_formatting
	return transform(annotation, [
		[/\[/g, '&#91;'],
		[/\]/g, '&#93;'],
	]);
}

function buildEditNote(info: ReleaseInfo, options: ReleaseSeedOptions): string {
	const lines = info.providers.map(({ name, url, apiUrl }) => {
		let line = `* ${name}: ${url}`;
		if (apiUrl) line += ` (API: ${apiUrl})`;
		return line;
	});

	const { projectUrl, seederUrl } = options;
	const sourceUrl = seederUrl ? createReleasePermalink(info, seederUrl) : projectUrl;
	lines.unshift(`${options.isUpdate ? 'Updated' : 'Imported'} with Harmony (${sourceUrl}), using data from:`);

	return lines.join('\n');
}
