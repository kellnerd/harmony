import { createReleasePermalink, encodeReleaseLookupState } from '@/server/state.ts';
import { determineReleaseEventCountries } from './release_countries.ts';
import { urlTypeIds } from './type_id.ts';
import { preferArray } from 'utils/array/scalar.js';
import { flatten } from 'utils/object/flatten.js';
import { transform } from 'utils/string/transform.js';

import type { ArtistCreditSeed, ReleaseSeed } from '@kellnerd/musicbrainz/seeding/release';
import type { UrlLinkTypeId } from './type_id.ts';
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
		type: Array.from(release.types?.values() || []),
		packaging: release.packaging,
		mediums: release.media.map((medium) => ({
			format: medium.format,
			name: medium.title,
			track: medium.tracklist.map((track) => ({
				name: track.title,
				artist_credit: convertArtistCredit(track.artists),
				number: track.number?.toString(),
				length: track.length,
			})),
		})),
		language: release.language?.code,
		script: release.script?.code,
		urls: release.externalLinks.flatMap((link) =>
			link.types?.length
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
		redirect_uri: redirectUrl?.href,
	};

	return flatten(seed);
}

export function convertArtistCredit(artists?: ArtistCreditName[]): ArtistCreditSeed | undefined {
	if (!artists) return;

	const lastIndex = artists.length - 1;
	return {
		names: artists.map((artist, index) => {
			const defaultJoinPhrase = (index !== lastIndex) ? (index === lastIndex - 1 ? ' & ' : ', ') : undefined;

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
		case 'license':
			return urlTypeIds['license'];
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
