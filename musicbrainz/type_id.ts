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

export type UrlLinkType = keyof typeof urlTypeIds;

export type UrlLinkTypeId = typeof urlTypeIds[UrlLinkType];
