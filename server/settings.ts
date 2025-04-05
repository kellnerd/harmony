import { IS_BROWSER } from 'fresh/runtime.ts';

export function getSetting(key: string, defaultValue?: string): string | undefined {
	if (IS_BROWSER) {
		return localStorage.getItem(key) ?? defaultValue;
	} else {
		return defaultValue;
	}
}
