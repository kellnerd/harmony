import { zipObject } from './array.ts';

export type PartialDate = Partial<{
	day: number;
	month: number;
	year: number;
}>;

/** Parses `YYYY-MM-DD` date strings */
export function parseHyphenatedDate(date: string): PartialDate {
	if (date.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
		return zipObject(['year', 'month', 'day'], date.split('-').map((component) => Number.parseInt(component)));
	}
	return {};
}
