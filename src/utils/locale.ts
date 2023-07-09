import type { ScriptFrequency } from './script.ts';
import type { CountryCode, Language } from '../harmonizer/types.ts';

let languageNames: Intl.DisplayNames, regionNames: Intl.DisplayNames, scriptNames: Intl.DisplayNames;

/** Gets the English display name for the region of a country code. */
export function regionName(code: CountryCode) {
	regionNames ??= new Intl.DisplayNames('en', {
		type: 'region',
	});
	code = code.toUpperCase();

	// handle special codes which are used by MusicBrainz
	if (code === 'XW') return '[Worldwide]';
	else if (code === 'XE') return 'Europe';

	return regionNames.of(code);
}

/** Formats a language's code and its optional confidence for display. */
export function formatLanguageConfidence({ code, confidence }: Language): string {
	languageNames ??= new Intl.DisplayNames('en', {
		type: 'language',
		languageDisplay: 'standard',
	});

	let formattedLanguage = languageNames.of(code)!;

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
