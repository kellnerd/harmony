import { createReleasePermalink, encodeReleaseLookupState } from '@/server/state.ts';
import { determineReleaseEventCountries } from './release_countries.ts';
import { urlTypeIds } from './type_id.ts';
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
		urls: release.externalLinks.flatMap<ReleaseUrlSeed>((link) =>
			link.types?.length
				? link.types.map((type) => ({
					url: link.url.href,
					link_type: convertLinkType('release', type, link.url),
				}))
				: ({
					url: link.url.href,
				})
		),
		annotation: buildAnnotation(release),
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
				artist: artist.name !== artist.creditedName ? { name: artist.name } : undefined,
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

function buildAnnotation(release: HarmonyRelease): string {
	const sections: string[] = [];

	if (release.copyright) {
		sections.push(`Copyright: ${release.copyright}`);
	}
	if (release.credits) {
		sections.push(`=== Credits from ${release.info.sourceMap?.credits!} ===`, release.credits);
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
	lines.unshift(`Imported with Harmony (${sourceUrl}), using data from:`);

	return lines.join('\n');
}
