import { createReleasePermalink } from '@/server/state.ts';
import { determineReleaseEventCountries } from './release_countries.ts';
import { urlTypeIds } from './type_id.ts';
import { preferArray } from 'utils/array/scalar.js';
import { flatten } from 'utils/object/flatten.js';

import type { ArtistCreditSeed, ReleaseSeed } from '@kellnerd/musicbrainz/seeding/release';
import type { UrlLinkTypeId } from './type_id.ts';
import type { ArtistCreditName, HarmonyRelease, LinkType, ReleaseInfo } from '@/harmonizer/types.ts';
import type { FormDataRecord } from 'utils/types.d.ts';

export interface ReleaseSeedOptions {
	/** URL of the project which was used to seed the release, for edit notes. */
	projectUrl: URL;
	/** Base URL of the Harmony instance which was used to seed the release, for permalinks. */
	seederUrl?: URL;
}

export function createReleaseSeed(release: HarmonyRelease, options: ReleaseSeedOptions): FormDataRecord {
	const countries = preferArray(determineReleaseEventCountries(release));

	const seed: ReleaseSeed = {
		name: release.title,
		artist_credit: convertArtistCredit(release.artists),
		barcode: release.gtin?.toString(),
		events: countries.map((country) => ({
			date: release.releaseDate,
			country,
		})),
		labels: release.labels?.map((label) => ({
			name: label.name,
			catalog_number: label.catalogNumber,
			mbid: label.mbid,
		})),
		status: release.status,
		packaging: release.packaging,
		mediums: release.media.map((medium) => ({
			format: medium.format,
			name: medium.title,
			track: medium.tracklist.map((track) => ({
				name: track.title,
				artist_credit: convertArtistCredit(track.artists),
				number: track.number.toString(),
				length: track.duration,
			})),
		})),
		language: release.language?.code,
		script: release.script?.code,
		urls: release.externalLinks.flatMap((link) =>
			link.types
				? link.types.map((type) => ({
					url: link.url.href,
					link_type: convertLinkType(type, link.url),
				}))
				: ({
					url: link.url.href,
				})
		),
		annotation: buildAnnotation(release),
		edit_note: buildEditNote(release.info, options),
	};

	return flatten(seed);
}

export function convertArtistCredit(artists?: ArtistCreditName[]): ArtistCreditSeed | undefined {
	if (!artists) return;

	return {
		names: artists.map((artist, index) => {
			const defaultJoinPhrase = (index !== artists.length - 1) ? ', ' : undefined;

			return {
				artist: { name: artist.name },
				mbid: artist.mbid,
				name: artist.creditedName,
				join_phrase: artist.joinPhrase ?? defaultJoinPhrase,
			};
		}),
	};
}

// deno-lint-ignore no-unused-vars
function convertLinkType(linkType: LinkType, url?: URL): UrlLinkTypeId | undefined {
	switch (linkType) {
		case 'free streaming':
			return urlTypeIds['free streaming'];
		case 'paid streaming':
			return urlTypeIds.streaming;
		case 'free download':
			return urlTypeIds['download for free'];
		case 'paid download':
			return urlTypeIds['purchase for download'];
		case 'mail order':
			return urlTypeIds['purchase for mail-order'];
		case 'discography page':
			// TODO: handle special cases based on their URLs
			return urlTypeIds['discography entry'];
	}
}

function buildAnnotation(release: HarmonyRelease): string {
	const lines: string[] = [];

	if (release.copyright) {
		lines.push(`Copyright: ${release.copyright}`);
	}

	return lines.join('\n');
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
