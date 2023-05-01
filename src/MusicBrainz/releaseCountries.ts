import type { CountryCode, HarmonyRelease } from '../harmonizer/types.ts';

export function determineReleaseEventCountries(release: HarmonyRelease, maxEvents = 10): CountryCode[] | undefined {
	if (!release.availableIn) {
		return;
	} else if (release.availableIn.length <= maxEvents) {
		return release.availableIn;
	} else if (!isImportantRegionExcluded(release.excludedFrom)) {
		return ['XW'];
	}
}

function isImportantRegionExcluded(excludedRegions?: CountryCode[]): boolean {
	if (!excludedRegions?.length) return false;
	if (excludedRegions.length > ignoredExcludedRegions.length) return true;
	return excludedRegions.some((region) => !ignoredExcludedRegions.includes(region));
}

const uninhabitedRegions = [
	'IO', // British Indian Ocean Territory
];

const dependentTerritories = [
	'CC', // Cocos (Keeling) Islands -> Australia
	'CK', // Cook Islands -> New Zealand
	'CX', // Christmas Island -> Australia
	'FK', // Falkland Islands -> Great Britain
	'NF', // Norfolk Island -> Australia
	'NU', // Niue -> New Zealand
	'SJ', // Svalbard and Jan Mayen -> Norway
	'TK', // Tokelau -> New Zealand
];

const ignoredExcludedRegions = [
	...uninhabitedRegions,
	...dependentTerritories,
];
