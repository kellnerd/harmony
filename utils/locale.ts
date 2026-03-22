import type { ScriptFrequency } from './script.ts';
import type { CountryCode, Language } from '@/harmonizer/types.ts';

let languageNames: Intl.DisplayNames, regionNames: Intl.DisplayNames, scriptNames: Intl.DisplayNames;

/** Gets the English display name for the region of a country code. */
export function regionName(code: CountryCode) {
	regionNames ??= new Intl.DisplayNames('en', {
		type: 'region',
	});
	code = code.toUpperCase();

	const specialRegionName = specialRegionCodes[code];
	if (specialRegionName) {
		return specialRegionName;
	}

	return regionNames.of(code);
}

const specialRegionCodes: Record<string, string | undefined> = {
	// Special codes which are used by MusicBrainz
	XW: '[Worldwide]',
	XE: 'Europe',
	// Historical ISO codes
	AN: 'Netherlands Antilles',
	CS: 'Serbia and Montenegro',
	SU: 'Soviet Union',
	XC: 'Czechoslovakia',
	XG: 'East Germany',
	YU: 'Yugoslavia',
};

/** Formats a language's code and its optional confidence for display. */
export function formatLanguageConfidence({ code, confidence }: Language): string {
	languageNames ??= new Intl.DisplayNames('en', {
		type: 'language',
		languageDisplay: 'standard',
	});

	let formattedLanguage = languageNames.of(code)!;

	// Temporary workaround for the incomplete ICU in Deno/Chromium:
	// https://github.com/denoland/deno/issues/13257#issuecomment-2132257563
	if (formattedLanguage === 'rn') {
		formattedLanguage = 'Rundi';
	} else if (formattedLanguage === 'zxx') {
		formattedLanguage = '[No linguistic content]';
	}

	if (confidence) {
		formattedLanguage += ` (${percentage(confidence)}% confidence)`;
	}

	return formattedLanguage;
}

/** Formats a script's code and frequency for display. */
export function formatScriptFrequency({ code, frequency }: ScriptFrequency): string {
	scriptNames ??= new Intl.DisplayNames('en', {
		type: 'script',
	});

	return `${scriptNames.of(code)} (${percentage(frequency)}%)`;
}

function percentage(value: number): string {
	return (100 * value).toFixed(0);
}
