export const statusTypeIds = {
	'Official': 1,
	'Promotion': 2,
	'Bootleg': 3,
	'Pseudo-Release': 4,
} as const;

export const packagingTypeIds = {
	'Book': 9,
	'Box': 19,
	'Cardboard/Paper Sleeve': 4,
	'Cassette Case': 8,
	'Digibook': 17,
	'Digipak': 3,
	'Discbox Slider': 13,
	'Fatbox': 10,
	'Gatefold Cover': 12,
	'Jewel Case': 1,
	'Keep Case': 6,
	'Plastic Sleeve': 18,
	'Slidepack': 20,
	'Slim Jewel Case': 2,
	'Snap Case': 11,
	'SnapPack': 21,
	'Super Jewel Box': 16,
	'Other': 5,
	'None': 7,
} as const;

export const urlTypeIds = {
	'production': 72,
	'amazon asin': 77,
	'discography entry': 288,
	'license': 301,
	'get the music': 73,
	'purchase for mail-order': 79,
	'purchase for download': 74,
	'download for free': 75,
	'free streaming': 85,
	'streaming': 980,
	'crowdfunding page': 906,
	'show notes': 729,
	'other databases': 82,
	'discogs': 76,
	'vgmdb': 86,
	'secondhandsongs': 308,
	'allmusic': 755,
	'BookBrainz': 850,
} as const;

export const primaryTypeIds = {
	'Album': 1,
	'Single': 2,
	'EP': 3,
	'Broadcast': 12,
	'Other': 11,
} as const;

export const secondaryTypeIds = {
	'Audio drama': 11,
	'Audiobook': 5,
	'Compilation': 1,
	'Demo': 10,
	'DJ-mix': 8,
	'Interview': 4,
	'Live': 6,
	'Mixtape/Street': 9,
	'Remix': 7,
	'Soundtrack': 2,
	'Spokenword': 3,
} as const;

export type ReleaseStatus = keyof typeof statusTypeIds;

export type Packaging = keyof typeof packagingTypeIds;

export type UrlLinkType = keyof typeof urlTypeIds;

export type UrlLinkTypeId = typeof urlTypeIds[UrlLinkType];

export type PrimaryType = keyof typeof primaryTypeIds;

export type SecondaryType = keyof typeof secondaryTypeIds;

export type ReleaseGroupType = PrimaryType | SecondaryType;
