/** ISO 15924 script codes, ordered by frequency (in MusicBrainz). */
export const scriptCodes = [
	'Latn',
	'Hani', // Han subsets `Hant` and `Hans` are not defined as Unicode character classes
	'Kana',
	'Hira',
	'Cyrl',
	'Grek',
	'Hang',
	'Hebr',
	'Arab',
	'Thai',
] as const;

/** ISO 15924 script codes which are defined as Unicode character classes. */
type UnicodeScriptCode = typeof scriptCodes[number];

/** ISO 15924 script codes which are aliases for combinations of multiple Unicode character classes. */
type CombinedScriptCode = 'Jpan' | 'Kore';

const scriptCombinations: Record<CombinedScriptCode, UnicodeScriptCode[]> = {
	'Jpan': ['Kana', 'Hira', 'Hani'],
	'Kore': ['Hang', 'Hani'],
};

// TODO: Tune weights of logographic scripts.
export const scriptWeights: Partial<Record<UnicodeScriptCode, number>> = {
	'Hani': 4,
	'Hira': 3,
	'Kana': 3,
};

/** ISO 15924 four letter script code. */
export type ScriptCode = UnicodeScriptCode | CombinedScriptCode;

export type ScriptFrequency = {
	code: ScriptCode;
	frequency: number;
};

/** Detects the scripts in which the input is written and orders them by frequency (descending). */
export function detectScripts(text: string, possibleScripts: readonly UnicodeScriptCode[]): ScriptFrequency[] {
	const detectedScripts: ScriptFrequency[] = [];
	const letters = text.replaceAll(/\P{Letter}/gu, '');
	let remainingLetters = letters.length;
	let weightedSum = 0;

	for (const code of possibleScripts) {
		const scriptRegex = new RegExp(`\\p{Script=${code}}`, 'gu');
		const scriptMatches = letters.matchAll(scriptRegex);
		const scriptLetterCount = [...scriptMatches].length;

		if (scriptLetterCount) {
			const scriptWeight = scriptWeights[code];
			let weightedCount = scriptLetterCount;
			if (scriptWeight) {
				weightedCount *= scriptWeight;
			}

			detectedScripts.push({ code, frequency: weightedCount });
			weightedSum += weightedCount;

			// Stop testing once all letters have been classified.
			remainingLetters -= scriptLetterCount;
			if (!remainingLetters) break;
		}
	}

	// Normalize weighted counts by weighted sum to obtain the frequency.
	detectedScripts.forEach((script) => script.frequency /= weightedSum);

	// Calculate total frequency of combined scripts.
	(Object.entries(scriptCombinations) as [CombinedScriptCode, ScriptCode[]][]).forEach(
		([combinedScript, combination]) => {
			const frequencies = detectedScripts
				.filter((script) => combination.includes(script.code))
				.map((script) => script.frequency);

			if (frequencies.length > 1) {
				detectedScripts.push({
					code: combinedScript,
					frequency: frequencies.reduce((sum, current) => sum + current, 0),
				});
			}
		},
	);

	return detectedScripts.sort((a, b) => b.frequency - a.frequency);
}

/** Detects the main script of the given text when its frequency is above the specified minimum. */
export function detectMainScript(text: string, possibleScripts: readonly UnicodeScriptCode[], {
	minFrequency = 0.75,
} = {}): ScriptCode | undefined {
	const scripts = detectScripts(text, possibleScripts);
	if (scripts.length && scripts[0].frequency >= minFrequency) {
		return scripts[0].code;
	}
}
