/** ISO 15924 script codes, ordered by frequency (in MusicBrainz). */
export const scriptCodes = [
	'Latn',
	'Hani',
	// Unicode character classes of Han subsets are not supported in RegExp
	// 'Hant', // subset of Hani
	// 'Hans', // subset of Hani
	'Kana',
	'Hira',
	'Cyrl',
	'Grek',
	'Hang',
	'Hebr',
	'Arab',
	'Thai',
] as const;

type DetectableScriptCode = typeof scriptCodes[number];

type CombinedScriptCode = 'Jpan' | 'Kore';

const scriptCombinations: Record<CombinedScriptCode, DetectableScriptCode[]> = {
	'Jpan': ['Kana', 'Hira', 'Hani'],
	'Kore': ['Hang', 'Hani'],
};

/** ISO 15924 four letter script code. */
export type ScriptCode = DetectableScriptCode | CombinedScriptCode;

export type ScriptFrequency = {
	script: ScriptCode;
	frequency: number;
};

/** Detects the scripts in which the input is written and orders them by frequency (descending). */
export function detectScripts(text: string, possibleScripts: readonly DetectableScriptCode[]): ScriptFrequency[] {
	const detectedScripts: ScriptFrequency[] = [];
	const letters = text.replaceAll(/\P{Letter}/gu, '');
	const totalLetters = letters.length;
	let remainingLetters = totalLetters;

	for (const script of possibleScripts) {
		const scriptRegex = new RegExp(`\\p{Script=${script}}`, 'gu');
		const scriptMatches = letters.matchAll(scriptRegex);
		const scriptLetterCount = [...scriptMatches].length;

		if (scriptLetterCount) {
			// TODO: increase weight of logographic scripts?
			detectedScripts.push({ script, frequency: scriptLetterCount / totalLetters });

			// stop testing once all letters have been classified
			remainingLetters -= scriptLetterCount;
			if (!remainingLetters) break;
		}
	}

	// calculate total frequency of combined scripts
	(Object.entries(scriptCombinations) as [CombinedScriptCode, ScriptCode[]][]).forEach(
		([combinedScript, combination]) => {
			const frequencies = detectedScripts
				.filter((script) => combination.includes(script.script))
				.map((script) => script.frequency);

			if (frequencies.length > 1) {
				detectedScripts.push({
					script: combinedScript,
					frequency: frequencies.reduce((sum, current) => sum + current),
				});
			}
		},
	);

	return detectedScripts.sort((a, b) => b.frequency - a.frequency);
}

/** Detects the main script of the given text when its frequency is above the specified minimum. */
export function detectMainScript(text: string, possibleScripts: readonly DetectableScriptCode[], {
	minFrequency = 0.75,
} = {}): ScriptCode | undefined {
	const scripts = detectScripts(text, possibleScripts);
	if (scripts.length && scripts[0].frequency >= minFrequency) {
		return scripts[0].script;
	}
}
