import ReleaseSeeder from './abstract.ts';
import { urlTypeIds } from '../MusicBrainz/typeId.ts';
import { preferArray } from 'utils/array/scalar.js';
import { flatten } from 'utils/object/flatten.js';
import type { ArtistCreditName, HarmonyRelease } from '../providers/common.ts';
import type { PartialDate } from '../utils/date.ts';
import type { Packaging, ReleaseGroupType, ReleaseStatus, UrlLinkTypeId } from '../MusicBrainz/typeId.ts';
import type { FormDataRecord, MaybeArray } from 'utils/types.d.ts';

export default class MusicBrainzSeeder extends ReleaseSeeder {
	readonly targetUrl = new URL('/release/add', 'https://musicbrainz.org');

	createReleaseSeed(release: HarmonyRelease): FormDataRecord {
		const seed: ReleaseSeed = {
			name: release.title,
			artist_credit: this.convertArtistCredit(release.artists),
			barcode: release.gtin.toString(),
			events: [{
				date: release.releaseDate,
			}],
			labels: release.labels?.map((label) => ({
				name: label.name,
				catalog_number: label.catalogNumber,
				// mbid: resolveToMBID(label.externalLink), // TODO
			})),
			status: 'Official',
			packaging: 'None',
			mediums: release.media.map((medium) => ({
				format: 'Digital Media',
				position: medium.number,
				name: medium.title,
				track: medium.tracklist.map((track) => ({
					name: track.title,
					artist_credit: this.convertArtistCredit(track.artists),
					number: track.number.toString(),
					length: track.duration,
				})),
			})),
			urls: preferArray(release.externalLink).map((url) => ({
				url: url.href,
				link_type: urlTypeIds.streaming, // TODO
			})),
		};
		return flatten(seed);
	}

	convertArtistCredit(artists?: ArtistCreditName[]): ArtistCreditSeed | undefined {
		if (!artists) return;
		return {
			names: artists.map((artist) => ({
				artist: { name: artist.name },
				// mbid: resolveToMBID(artist.externalLink), // TODO
				name: artist.creditedName,
				join_phrase: artist.joinPhrase,
			})),
		};
	}
}

// Adapted from https://musicbrainz.org/doc/Development/Release_Editor_Seeding

type ReleaseSeed =
	& {
		/** The name of the release. Non-empty string. Required. */
		name: string;
	}
	& Partial<{
		/**
		 * The MBID of an existing release group.
		 * Alternatively we can create a new release group which will have the name of the release by listing its type(s).
		 */
		release_group: MBID;
		/**
		 * The type(s) of the release group that will be created.
		 * The possible values are the names of the release group types, in English (see the documentation).
		 * This can be specified multiple times to select multiple secondary types, though only one primary type should be
		 * specified (if you specify more than one, only one will be set).
		 */
		type: MaybeArray<ReleaseGroupType>;
		/** A disambiguation comment for the release. Non-empty string. */
		comment: string;
		/** Text to place in the releases annotation. Use a text area / multi-line text. */
		annotation: string;
		/** The barcode of the release. May be any valid barcode without whitespace. To indicate there is no barcode, seed "none". */
		barcode: string;
		/**
		 * The language of the release.
		 * May be any valid [ISO 639-3](https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes) code (for example: `eng`, `deu`, `jpn`).
		 */
		language: string;
		/**
		 * The script of the text on the release.
		 * May be any valid [ISO 15924](https://en.wikipedia.org/wiki/ISO_15924) code (for example: `Latn`, `Cyrl`).
		 */
		script: string;
		/** The status of the release, as defined by MusicBrainz. */
		status: ReleaseStatus;
		/** The type of packaging of the release. The possible values are the names of the release group types, in English (see the documentation). */
		packaging: Packaging;

		/**
		 * A release can have zero, one or several release events. Each release event is composed of a date and a country.
		 * Any of the fields can be omitted or sent blank if unknown (so, you can seed only the year and country, or only the month and day).
		 */
		events: Array<
			Partial<{
				/** The date of the release event. Each field is an integer. */
				date: PartialDate;
				/** The country of the release event. May be any valid country ISO code (for example: `GB`, `US`, `FR`). */
				country: string;
			}>
		>;

		/** Releases may be associated with multiple labels and catalog numbers. */
		labels: Array<
			Partial<{
				/** The MBID of the label. */
				mbid: MBID;
				/** The catalog number of this release, for the current label. */
				catalog_number: string;
				/**
				 * The name of the label (to prefill the field in order to search for the label via the site interface).
				 * If an MBID is present, this value is ignored.
				 */
				name: string;
			}>
		>;

		/** A release may be credited to multiple artists via what is known as an Artist Credit. */
		artist_credit: ArtistCreditSeed;

		/** Tracklist data. */
		mediums: Array<
			Partial<{
				/** Any valid medium format name. The possible values are the names of the medium formats, in English (see the documentation). */
				format: string;
				/**
				 * The position of this medium in the list of mediums.
				 * If omitted, it will be inferred from the order of all mediums passed in (which is normally what you want).
				 */
				position: number;
				/** The name of the medium (for example “Live & Unreleased”). */
				name: string;

				track: Array<
					Partial<{
						/** The name of the track. */
						name: string;
						/** The free-form track number. */
						number: string;
						/** The MBID of an existing recording in the database which should be associated with the track. */
						recording: MBID;
						/** The tracks duration, in MM:SS form or a single integer as milliseconds. */
						length: string | number;
						artist_credit: ArtistCreditSeed;
					}>
				>;
			}>
		>;

		/** You can seed a list of URLs to add as relationships to the release. */
		urls: Array<{
			/** The URL to relate to. Non-empty string. */
			url: string;
			/** The integer link type ID to use for the relationship. Not required; if left blank, can be selected in the release editor. */
			link_type?: UrlLinkTypeId;
		}>;

		/** Specify the content of the edit note. Use a text area / multi-line text. */
		edit_note: string;
		/**
		 * A URI to redirect to after the release is submitted.
		 * The release's MBID will be added to this URI under the `release_mbid` query parameter.
		 * E.g., if http://example.com/ is provided for this, the user will be redirected to a URI like http://example.com/?release_mbid=4587fe99-db0e-4553-a56a-164dd38ab380.
		 */
		redirect_uri: string;
	}>;

type ArtistCreditSeed = {
	names: Array<
		Partial<{
			/**
			 * The MBID of the artist.
			 * If omitted you will be able to either create the artist in the release editor, or search MusicBrainz for this artist.
			 */
			mbid: MBID;
			/** The name of the artist, as credited on the release. Optional, if omitted it will default to the artist’s current name. */
			name: string;
			artist: {
				/**
				 * The name of the artist as it is usually referred too (to prefill the field in order to search for the artist via the site interface).
				 * Unneeded if you already specified both credited name and MBID.
				 */
				name: string;
			};
			/**
			 * An optional phrase to join this artist with the next artist.
			 * For example, you could use “ & ” to join “Calvin” with “Hobbes” to get the final text “Calvin & Hobbes”.
			 */
			join_phrase: string;
		}>
	>;
};

/** Format: `/[0-9a-f-]{36}/` (UUID) */
type MBID = string;
