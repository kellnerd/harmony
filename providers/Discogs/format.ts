import type { MediumFormat } from '@/harmonizer/types.ts';

export const mediumFormatMap: Record<string, MediumFormat | undefined> = {
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
