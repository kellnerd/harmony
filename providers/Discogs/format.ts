import type { MediumFormat, ReleaseGroupType } from '@/harmonizer/types.ts';
import type { ReleasePackaging, ReleaseStatus } from '@kellnerd/musicbrainz/data/release';
import type { ReleaseFormat } from './api_types.ts';

/** Converts a Discogs release format specifier into an array of medium formats. */
export function convertFormat(format: ReleaseFormat): Array<MediumFormat | undefined> {
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

/** Extracts release status, type and packaging from release format specifiers. */
export function extractMoreDetailsFromFormats(formats: ReleaseFormat[]) {
	const types: ReleaseGroupType[] = [];
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
					types.push(mappedType);
				}
			}
		}
	}

	if (!packaging) {
		if (formats.every((format) => format.name === 'File')) {
			packaging = 'None';
		}
	}

	return { status, types, packaging };
}

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
