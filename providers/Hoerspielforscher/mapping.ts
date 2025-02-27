import type { MediumFormat } from '@/harmonizer/types.ts';

export const mediumFormatMap: Record<string, MediumFormat | undefined> = {
	'Audio CD': 'CD',
	'Audio-CD': 'CD',
	'Audio-Dateien': 'Digital Media',
	'12"-Vinyl, 33 1/3 rpm': '12" Vinyl',
	'Musik-Cassette': 'Cassette',
};

/** Analog medium formats which have two sides. */
export const twoSidedFormats = new Set<MediumFormat>([
	'12" Vinyl',
	'Cassette',
]);
