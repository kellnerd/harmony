// TODO: Move into @kellnerd/musicbrainz/data/link_type.ts

import type { EntityType } from '@kellnerd/musicbrainz/data/entity';

export const artistUrlTypeIds = {
	'discography': 171,
	'fanpage': 172,
	'image': 173,
	'purevolume': 174,
	'purchase for mail-order': 175,
	'purchase for download': 176,
	'download for free': 177,
	'IMDb': 178,
	'wikipedia': 179,
	'discogs': 180,
	'biography': 182,
	'official homepage': 183,
	'discography page': 184,
	'online community': 185,
	'get the music': 187,
	'other databases': 188,
	'myspace': 189,
	'vgmdb': 191,
	'social network': 192,
	'youtube': 193,
	'free streaming': 194,
	'lyrics': 197,
	'blog': 199,
	'allmusic': 283,
	'soundcloud': 291,
	'video channel': 303,
	'secondhandsongs': 307,
	'VIAF': 310,
	'wikidata': 352,
	'interview': 707,
	'bandcamp': 718,
	'IMSLP': 754,
	'songkick': 785,
	'setlistfm': 816,
	'last.fm': 840,
	'online data': 841,
	'BookBrainz': 852,
	'bandsintown': 862,
	'patronage': 897,
	'crowdfunding': 902,
	'CD Baby': 919,
	'streaming': 978,
	'CPDL': 981,
	'youtube music': 1080,
	'apple music': 1131,
	'art gallery': 1192,
	'ticketing': 1193,
} as const;

export type ArtistUrlLinkType = keyof typeof artistUrlTypeIds;

export const labelUrlTypeIds = {
	'official site': 219,
	'lyrics': 982,
	'online data': 221,
	'blog': 224,
	'history site': 211,
	'catalog site': 212,
	'logo': 213,
	'fanpage': 214,
	'crowdfunding': 903,
	'patronage': 899,
	'ticketing': 1194,
	'social network': 218,
	'myspace': 215,
	'soundcloud': 290,
	'video channel': 304,
	'youtube': 225,
	'get the music': 957,
	'purchase for mail-order': 960,
	'purchase for download': 959,
	'download for free': 958,
	'free streaming': 997,
	'streaming': 1005,
	'apple music': 1130,
	'bandcamp': 719,
	'other databases': 222,
	'BookBrainz': 851,
	'IMDb': 313,
	'VIAF': 311,
	'discogs': 217,
	'last.fm': 838,
	'secondhandsongs': 977,
	'vgmdb': 210,
	'wikidata': 354,
	'wikipedia': 216,
};

export type LabelUrlLinkType = keyof typeof labelUrlTypeIds;

export const recordingUrlTypeIds = {
	'license': 302,
	'production': 256,
	'IMDB samples': 258,
	'get the music': 257,
	'purchase for download': 254,
	'download for free': 255,
	'free streaming': 268,
	'streaming': 979,
	'crowdfunding': 905,
	'other databases': 306,
	'allmusic': 285,
	'secondhandsongs': 976,
};

export type RecordingUrlTypeIds = keyof typeof recordingUrlTypeIds;

export const releaseUrlTypeIds = {
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

export type ReleaseUrlLinkType = keyof typeof releaseUrlTypeIds;

export type UrlLinkType = ArtistUrlLinkType | LabelUrlLinkType | RecordingUrlTypeIds | ReleaseUrlLinkType;

export const urlTypeIds: Partial<Record<EntityType, Partial<Record<UrlLinkType, number>>>> = {
	artist: artistUrlTypeIds,
	label: labelUrlTypeIds,
	recording: recordingUrlTypeIds,
	release: releaseUrlTypeIds,
};
