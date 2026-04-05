import type { CountryCode } from '@/harmonizer/types.ts';
import { isDefined } from '@/utils/predicate.ts';

/**
 * Converts a Discogs "country" name into an array of country codes.
 */
export function convertCountryStringToCodes(countryName: string): CountryCode[] | undefined {
	// TODO: handle historical regions and region names?
	const countryCode = countryNameToCode[countryName];
	if (countryCode) {
		return [countryCode];
	}

	const countryGroupCodes = countryGroupToCodes[countryName];
	if (countryGroupCodes) {
		return countryGroupCodes;
	}

	const countryCodes = countryName.split(countrySeparator).map((part) => countryNameToCode[part]);
	if (countryCodes.every(isDefined)) {
		return countryCodes;
	}
}

/**
 * Maps a country name (as used on Discogs) to a country code.
 *
 * Country names extracted from "subform/view:countries" data on release edit page.
 */
const countryNameToCode: Record<string, CountryCode | undefined> = {
	Afghanistan: 'AF',
	Albania: 'AL',
	Algeria: 'DZ',
	'American Samoa': 'AS',
	Andorra: 'AD',
	Angola: 'AO',
	Anguilla: 'AI',
	Antarctica: 'AQ',
	'Antigua & Barbuda': 'AG',
	Argentina: 'AR',
	Armenia: 'AM',
	Aruba: 'AW',
	Australia: 'AU',
	Austria: 'AT',
	Azerbaijan: 'AZ',
	'Bahamas, The': 'BS',
	Bahrain: 'BH',
	Bangladesh: 'BD',
	Barbados: 'BB',
	Belarus: 'BY',
	Belgium: 'BE',
	Belize: 'BZ',
	Benin: 'BJ',
	Bermuda: 'BM',
	Bhutan: 'BT',
	Bolivia: 'BO',
	'Bosnia & Herzegovina': 'BA',
	Botswana: 'BW',
	Brazil: 'BR',
	'British Indian Ocean Territory': 'IO',
	'British Virgin Islands': 'VG',
	Brunei: 'BN',
	Bulgaria: 'BG',
	'Burkina Faso': 'BF',
	Burma: 'MM', // Myanmar
	Burundi: 'BI',
	Cambodia: 'KH',
	Cameroon: 'CM',
	Canada: 'CA',
	'Cape Verde': 'CV',
	'Cayman Islands': 'KY',
	'Central African Republic': 'CF',
	Chad: 'TD',
	Chile: 'CL',
	China: 'CN',
	'Christmas Island': 'CX',
	'Cocos (Keeling) Islands': 'CC',
	Colombia: 'CO',
	Comoros: 'KM',
	'Congo, Democratic Republic of the': 'CD',
	'Congo, Republic of the': 'CG',
	'Cook Islands': 'CK',
	'Costa Rica': 'CR',
	Croatia: 'HR',
	Cuba: 'CU',
	'Curaçao': 'CW',
	Cyprus: 'CY',
	'Czech Republic': 'CZ',
	Denmark: 'DK',
	Djibouti: 'DJ',
	Dominica: 'DM',
	'Dominican Republic': 'DO',
	'East Timor': 'TL',
	Ecuador: 'EC',
	Egypt: 'EG',
	'El Salvador': 'SV',
	'Equatorial Guinea': 'GQ',
	Eritrea: 'ER',
	Estonia: 'EE',
	Ethiopia: 'ET',
	'Falkland Islands': 'FK',
	'Faroe Islands': 'FO',
	Fiji: 'FJ',
	Finland: 'FI',
	France: 'FR',
	'French Guiana': 'GF',
	'French Polynesia': 'PF',
	'French Southern & Antarctic Lands': 'TF',
	Gabon: 'GA',
	'Gambia, The': 'GM',
	Georgia: 'GE',
	Germany: 'DE',
	Ghana: 'GH',
	Gibraltar: 'GI',
	Greece: 'GR',
	Greenland: 'GL',
	Grenada: 'GD',
	Guadeloupe: 'GP',
	Guam: 'GU',
	Guatemala: 'GT',
	Guernsey: 'GG',
	Guinea: 'GN',
	'Guinea-Bissau': 'GW',
	Guyana: 'GY',
	Haiti: 'HT',
	Honduras: 'HN',
	'Hong Kong': 'HK',
	Hungary: 'HU',
	Iceland: 'IS',
	India: 'IN',
	Indonesia: 'ID',
	Iran: 'IR',
	Iraq: 'IQ',
	Ireland: 'IE',
	'Isle Of Man': 'IM',
	Israel: 'IL',
	Italy: 'IT',
	'Ivory Coast': 'CI',
	Jamaica: 'JM',
	Japan: 'JP',
	Jersey: 'JE',
	Jordan: 'JO',
	Kazakhstan: 'KZ',
	Kenya: 'KE',
	Kiribati: 'KI',
	Kosovo: 'XK',
	Kuwait: 'KW',
	Kyrgyzstan: 'KG',
	Laos: 'LA',
	Latvia: 'LV',
	Lebanon: 'LB',
	Lesotho: 'LS',
	Liberia: 'LR',
	Libya: 'LY',
	Liechtenstein: 'LI',
	Lithuania: 'LT',
	Luxembourg: 'LU',
	Macau: 'MO',
	Macedonia: 'MK',
	Madagascar: 'MG',
	Malawi: 'MW',
	Malaysia: 'MY',
	Maldives: 'MV',
	Mali: 'ML',
	Malta: 'MT',
	'Marshall Islands': 'MH',
	Martinique: 'MQ',
	Mauritania: 'MR',
	Mauritius: 'MU',
	Mayotte: 'YT',
	Mexico: 'MX',
	'Micronesia, Federated States of': 'FM',
	'Moldova, Republic of': 'MD',
	Monaco: 'MC',
	Mongolia: 'MN',
	Montenegro: 'ME',
	Montserrat: 'MS',
	Morocco: 'MA',
	Mozambique: 'MZ',
	Namibia: 'NA',
	Nauru: 'NR',
	Nepal: 'NP',
	Netherlands: 'NL',
	'New Caledonia': 'NC',
	'New Zealand': 'NZ',
	Nicaragua: 'NI',
	Niger: 'NE',
	Nigeria: 'NG',
	Niue: 'NU',
	'Norfolk Island': 'NF',
	'North Korea': 'KP',
	'Northern Mariana Islands': 'MP',
	Norway: 'NO',
	Oman: 'OM',
	Pakistan: 'PK',
	Palau: 'PW',
	Palestine: 'PS',
	Panama: 'PA',
	'Papua New Guinea': 'PG',
	Paraguay: 'PY',
	Peru: 'PE',
	Philippines: 'PH',
	'Pitcairn Islands': 'PN',
	Poland: 'PL',
	Portugal: 'PT',
	'Puerto Rico': 'PR',
	Qatar: 'QA',
	Reunion: 'RE',
	Romania: 'RO',
	Russia: 'RU',
	Rwanda: 'RW',
	'Saint Helena': 'SH',
	'Saint Kitts and Nevis': 'KN',
	'Saint Lucia': 'LC',
	'Saint Pierre and Miquelon': 'PM',
	'Saint Vincent and the Grenadines': 'VC',
	Samoa: 'WS',
	'San Marino': 'SM',
	'Sao Tome and Principe': 'ST',
	'Saudi Arabia': 'SA',
	Senegal: 'SN',
	Serbia: 'RS',
	Seychelles: 'SC',
	'Sierra Leone': 'SL',
	Singapore: 'SG',
	Slovakia: 'SK',
	Slovenia: 'SI',
	'Solomon Islands': 'SB',
	Somalia: 'SO',
	'South Africa': 'ZA',
	'South Georgia and the South Sandwich Islands': 'GS',
	'South Korea': 'KR',
	'Southern Sudan': 'SS',
	Spain: 'ES',
	'Sri Lanka': 'LK',
	Sudan: 'SD',
	Suriname: 'SR',
	Swaziland: 'SZ',
	Sweden: 'SE',
	Switzerland: 'CH',
	Syria: 'SY',
	Taiwan: 'TW',
	Tajikistan: 'TJ',
	Tanzania: 'TZ',
	Thailand: 'TH',
	Togo: 'TG',
	Tokelau: 'TK',
	Tonga: 'TO',
	'Trinidad & Tobago': 'TT',
	Tunisia: 'TN',
	Turkey: 'TR',
	Turkmenistan: 'TM',
	'Turks and Caicos Islands': 'TC',
	Tuvalu: 'TV',
	UK: 'GB',
	US: 'US',
	USA: 'US', // only in combinations
	Uganda: 'UG',
	Ukraine: 'UA',
	'United Arab Emirates': 'AE',
	Uruguay: 'UY',
	Uzbekistan: 'UZ',
	Vanuatu: 'VU',
	'Vatican City': 'VA',
	Venezuela: 'VE',
	Vietnam: 'VN',
	'Virgin Islands': 'VI', // U.S.
	'Wallis and Futuna': 'WF',
	'Western Sahara': 'EH',
	Yemen: 'YE',
	Zambia: 'ZM',
	Zimbabwe: 'ZW',
	// Special ISO codes
	Worldwide: 'XW',
	Europe: 'XE',
	// Historical ISO codes
	Czechoslovakia: 'XC',
	'German Democratic Republic (GDR)': 'XG',
	'Netherlands Antilles': 'AN',
	'Serbia and Montenegro': 'CS',
	USSR: 'SU',
	Yugoslavia: 'YU',
};

const _missingSubRegions = [
	{ label: 'Gaza Strip', value: '', pos: 114 }, // Palestine
	{ label: 'Wake Island', value: '', pos: 271 }, // United States Minor Outlying Islands
	{ label: 'West Bank', value: '', pos: 273 }, // Palestine
	{ label: 'Tibet', value: '', pos: 251 }, // China
	{ label: 'Abkhazia', value: 'GE-AB', pos: 31 }, // Georgia
	{ label: 'Zanzibar', value: '', pos: 278 }, // Tanzania
	{ label: 'Saar', value: '', pos: 219 }, // Germany
];

/** Separator that is used when Discogs joins multiple country/region names. */
const countrySeparator = /,? & |, /;

/**
 * Maps a country (group) name from Discogs to multiple country codes.
 *
 * Since not all terms are unambiguous, we use the most commonly included countries.
 * Dependent territories with their own ISO codes have been excluded.
 */
const countryGroupToCodes: Record<string, CountryCode[] | undefined> = {
	'Africa': undefined, // too many
	'Asia': undefined, // too many
	'Australasia': ['AU', 'NZ', 'PG'], // potentially ID for Western New Guinea
	'Benelux': ['BE', 'NL', 'LU'],
	'Central America': ['BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA'],
	'France & Benelux': ['FR', 'BE', 'NL', 'LU'],
	'Gulf Cooperation Council': ['AE', 'BA', 'KW', 'OM', 'QA', 'SA'],
	'Middle East': undefined, // 16 is too many
	'North America (inc Mexico)': ['CA', 'MX', 'US'],
	'Russia & CIS': ['RU', 'AM', 'AZ', 'BY', 'GE', 'KG', 'KZ', 'MD', 'TJ', 'TM', 'UA', 'UZ'], // 12 is too many?
	'Scandinavia': ['DK', 'NO', 'SE'], // potentially FI, IS
	'South America': ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'], // 12 is too many?
	'North & South America': undefined, // too many
	'South East Asia': ['BN', 'ID', 'KH', 'LA', 'MM', 'MY', 'PH', 'SG', 'TH', 'TL', 'VN'], // 11 is too many?
	'South Pacific': ['FJ', 'SB', 'TO', 'TV', 'VU', 'WS'], // = Melanesia + Polynesia - Australasia ?
};

const _historicalRegions = [
	{ label: 'Austria-Hungary', value: 'AUT/HUN', pos: 45 },
	{ label: 'Protectorate of Bohemia and Moravia', value: '', pos: 212 },
	{ label: 'Southern Rhodesia', value: '', pos: 236 }, // Zimbabwe
	{ label: 'Dahomey', value: '', pos: 90 }, // Benin
	{ label: 'Dutch East Indies', value: '', pos: 95 }, // Indonesia
	{ label: 'Ottoman Empire', value: '', pos: 200 },
	{ label: 'Rhodesia', value: '', pos: 216 }, // Zimbabwe
	{ label: 'Upper Volta', value: '', pos: 263 }, // Burkina Faso
	{ label: 'Zaire', value: '', pos: 278 }, // Democratic Republic of the Congo
	{ label: 'Bohemia', value: '', pos: 58 },
	{ label: 'Korea (pre-1945)', value: '', pos: 152 },
	{ label: 'Indochina', value: '', pos: 136 },
	{ label: 'South Vietnam', value: 'SVI', pos: 239 },
	{ label: 'South West Africa', value: '', pos: 239 }, // Namibia
	{ label: 'Belgian Congo', value: '', pos: 54 }, // Democratic Republic of the Congo
	{ label: 'Czech And Slovak Federative Republic', value: 'CSFR', pos: 24 },
	{ label: 'Italian East Africa', value: '', pos: 140 },
];
