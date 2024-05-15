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

/** Parses a German date with the month given as a string. */
export function parseGermanDate(date: string): PartialDate | undefined {
	const dateMatch = date.match(/^(?:(\d{1,2})\. )?(?:(\w+) )?(\d{4})$/);
	if (!dateMatch) return;

	const [_, day, monthName, year] = dateMatch;
	return {
		day: day ? parseInt(day, 10) : undefined,
		month: monthName ? (monthNamesGerman.indexOf(monthName) + 1) : undefined,
		year: parseInt(year, 10),
	};
}

const monthNamesGerman = [
	'Januar',
	'Februar',
	'März',
	'April',
	'Mai',
	'Juni',
	'Juli',
	'August',
	'September',
	'Oktober',
	'November',
	'Dezember',
];

/** Parses `YYYY-MM-DD` date strings */
export function parseHyphenatedDate(date: string): PartialDate {
	if (date.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
		return zipObject(['year', 'month', 'day'], date.split('-').map((component) => Number.parseInt(component)));
	}
	return {};
}

/** Parses a simple ISO 8601 date time string (`YYYY-MM-DDTHH:mm:ss.sssZ`) */
export function parseISODateTime(dateTime: string): PartialDate {
	const date = new Date(dateTime);
	return {
		day: date.getUTCDate(),
		month: date.getUTCMonth() + 1,
		year: date.getUTCFullYear(),
	};
}
