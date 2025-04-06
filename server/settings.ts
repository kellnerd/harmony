import { IS_BROWSER } from 'fresh/runtime.ts';

/** Gets the value which the user has set for the given setting key. */
export function getSetting(key: string, defaultValue?: string): string | undefined {
	if (IS_BROWSER) {
		return localStorage.getItem(key) ?? defaultValue;
	} else {
		return defaultValue;
	}
}

/** Checks whether the user has enabled the given setting key. */
export function checkSetting(key: string, defaultValue = false): boolean {
	return getSetting(key, defaultValue ? '1' : '0') === '1';
}
