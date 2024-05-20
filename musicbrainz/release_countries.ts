import type { CountryCode, HarmonyRelease } from '@/harmonizer/types.ts';

export function determineReleaseEventCountries(release: HarmonyRelease, maxEvents = 10): CountryCode[] | undefined {
	const { availableIn, excludedFrom } = release;
	const worldwide = 'XW';
	if (!availableIn) {
		return;
	} else if (availableIn.includes(worldwide)) {
		return [worldwide];
	} else if (availableIn.length <= maxEvents) {
		return availableIn;
	} else if (!isImportantRegionExcluded(excludedFrom)) {
		return [worldwide];
	}
}

function isImportantRegionExcluded(excludedRegions?: CountryCode[]): boolean {
	if (!excludedRegions?.length) return false;
	if (excludedRegions.length > ignoredExcludedRegions.size) return true;
	return excludedRegions.some((region) => !ignoredExcludedRegions.has(region));
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

const ignoredExcludedRegions = new Set([
	...uninhabitedRegions,
	...dependentTerritories,
]);
