import type { MediumFormat, ReleaseGroupType } from '@/harmonizer/types.ts';
import type { ReleasePackaging, ReleaseStatus } from '@kellnerd/musicbrainz/data/release';
import type { ReleaseFormat } from './api_types.ts';

/** Converts a Discogs release format specifier into an array of medium formats. */
export function convertFormat(format: ReleaseFormat): Array<MediumFormat | undefined> {
	if (pseudoFormats.has(format.name)) {
		return [];
	}

	let mediumFormat = mediumFormatMap[format.name];
	if (mediumFormat) {
		for (const description of format.descriptions) {
			if (['Vinyl', 'Acetate', 'Shellac'].includes(mediumFormat)) {
				if (description === 'LP') {
					mediumFormat = `12" ${mediumFormat}` as MediumFormat;
				} else if (/^(3|7|10|12)"$/.test(description)) {
					mediumFormat = `${description} ${mediumFormat}` as MediumFormat;
				}
			} else if (mediumFormat === 'CD') {
				if (description === 'Mini') {
					mediumFormat = `8cm ${mediumFormat}` as MediumFormat;
				}
			} else if (mediumFormat === 'DVD') {
				if (description === 'DVD-Video' || description === 'DVD-Audio') {
					mediumFormat = description;
				}
			}
		}
	}
	const quantity = Number.parseInt(format.qty, 10);
	return new Array(quantity).fill(mediumFormat);
}

/**
 * Maps a Discogs format name to a Harmony/MusicBrainz medium format.
 *
 * Format names extracted from "subform/view:format_map" data on release edit page.
 */
const mediumFormatMap: Record<string, MediumFormat | undefined> = {
	'Acetate': 'Acetate',
	'Blu-ray': 'Blu-ray',
	'Cassette': 'Cassette',
	'CD': 'CD',
	'DVD': 'DVD',
	'File': 'Digital Media',
	'Flexi-disc': 'Flexi-disc',
	'Shellac': 'Shellac',
	'Vinyl': 'Vinyl',
	// WIP
};

/** Discogs format names which describe the overall release rather than a concrete medium. */
const pseudoFormats = new Set(['All Media', 'Box Set']);

/** Extracts release status, type and packaging from release format specifiers and styles. */
export function extractMoreDetailsFromFormatsAndStyles(formats: ReleaseFormat[], styles?: string[]) {
	const types: Set<ReleaseGroupType> = new Set();
	let status: ReleaseStatus = 'Official';
	let packaging: ReleasePackaging | undefined;

	for (const format of formats) {
		for (const description of format.descriptions) {
			if (description === 'Promo') {
				status = 'Promotion';
			} else if (description.includes('Unofficial')) {
				status = 'Bootleg';
			} else {
				const mappedType = releaseTypeMap[description];
				if (mappedType) {
					types.add(mappedType);
				}
			}
		}
	}

	if (styles) {
		for (const style of styles) {
			const mappedType = styleToReleaseType[style];
			if (mappedType) {
				types.add(mappedType);
			}
		}
	}

	if (!packaging) {
		if (formats.every((format) => format.name === 'File')) {
			packaging = 'None';
		}
	}

	return { status, types: [...types], packaging };
}

/**
 * Maps a Discogs format description to a MusicBrainz release group type.
 *
 * Descriptions extracted from "subform/view:format_map" data on release edit page.
 */
const releaseTypeMap: Record<string, ReleaseGroupType> = {
	'Album': 'Album',
	'EP': 'EP',
	'Single': 'Single',
	'Compilation': 'Compilation',
	'Mixtape': 'Mixtape/Street',
	'Mini-Album': 'EP',
	'Maxi-Single': 'Single',
	'Mixed': 'DJ-mix',
	'Partially Mixed': 'DJ-mix',
	// 'Sampler' is for excerpts/preview of a bigger release, not 'Compilation'.
	// 'Tour Recording' is not for one-off live albums, better guess 'Live' from titles.
};

/**
 * Maps a Discogs style (Non-Music, Stage & Screen) to a MusicBrainz release group type.
 *
 * Style names extracted from "subform/view:style_map" data on release edit page.
 */
const styleToReleaseType: Record<string, ReleaseGroupType> = {
	'Audiobook': 'Audiobook',
	'Cabaret': 'Spokenword',
	'Comedy': 'Spokenword',
	'Dialogue': 'Spokenword',
	'Field Recording': 'Field recording',
	'Interview': 'Interview',
	'Monolog': 'Spokenword',
	'Musical': 'Soundtrack',
	'Public Broadcast': 'Broadcast',
	'Radioplay': 'Audio drama',
	'Score': 'Soundtrack',
	'Soundtrack': 'Soundtrack',
	'Speech': 'Spokenword',
	'Spoken Word': 'Spokenword',
	'Theme': 'Soundtrack',
	'Video Game Music': 'Soundtrack',
};
