import type { MediumFormat } from '@/harmonizer/types.ts';
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
