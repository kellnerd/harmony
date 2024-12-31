import type { HarmonyRelease } from '@/harmonizer/types.ts';
import { formatLanguageConfidence, formatScriptFrequency } from '@/utils/locale.ts';
import { detectScripts, scriptCodes } from '@/utils/script.ts';
import lande from 'lande';

/** Detects the script and guesses the language of the given release (if missing). */
export function detectLanguageAndScript(release: HarmonyRelease): void {
	const allTitles = release.media.flatMap((medium) => medium.tracklist.map((track) => track.title));
	allTitles.push(release.title);

	if (!release.script) {
		const scripts = detectScripts(allTitles.join('\n'), scriptCodes);

		if (scripts.length) {
			const mainScript = scripts[0];

			release.info.messages.push({
				type: 'debug',
				text: `Detected scripts of the titles: ${scripts.map(formatScriptFrequency).join(', ')}`,
			});

			if (mainScript.frequency > 0.7) {
				release.script = mainScript;
			}
		} else {
			release.info.messages.push({
				type: 'warning',
				text: 'Titles are written in an unsupported script, please report',
			});
		}
	}

	// Guesses for single track releases are wrong more often than not, skip them.
	if (!release.language && allTitles.length > 2) {
		const guessedLanguages = lande(allTitles.join('\n'));
		const topLanguage = guessedLanguages[0];

		const formattedList = guessedLanguages
			.map(([code, confidence]) => ({ code, confidence }))
			.filter(({ confidence }) => confidence > 0.1)
			.map(formatLanguageConfidence);
		release.info.messages.push({
			type: 'debug',
			text: `Guessed language of the titles: ${formattedList.join(', ')}`,
		});

		if (topLanguage[1] > 0.8) {
			release.language = {
				code: topLanguage[0],
				confidence: topLanguage[1],
			};
		}
	}
}
