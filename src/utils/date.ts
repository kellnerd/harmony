import { zipObject } from 'utils/object/zipObject.js';

export type PartialDate = Partial<{
	day: number;
	month: number;
	year: number;
}>;

export function formatPartialDate(date: PartialDate) {
	const dateComponents: string[] = [];

	if (date.year) {
		dateComponents.push(date.year.toString().padStart(4, '0'));
		if (date.month) {
			dateComponents.push(date.month.toString().padStart(2, '0'));
			if (date.day) {
				dateComponents.push(date.day.toString().padStart(2, '0'));
			}
		}
	}

	return dateComponents.join('-');
}

/** Parses `YYYY-MM-DD` date strings */
export function parseHyphenatedDate(date: string): PartialDate {
	if (date.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
		return zipObject(['year', 'month', 'day'], date.split('-').map((component) => Number.parseInt(component)));
	}
	return {};
}
