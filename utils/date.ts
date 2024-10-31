import { zipObject } from 'utils/object/zipObject.js';
import { IS_BROWSER } from "$fresh/runtime.ts";

export type PartialDate = Partial<{
	day: number;
	month: number;
	year: number;
}>;

export function formatPartialDate(releaseDate: PartialDate) {
	
	// we return null for flashing Release date
	if(!releaseDate || !IS_BROWSER) {
		return null
	}
	
	if(IS_BROWSER){
        const {day, month, year} = releaseDate
        return new Date(Date.UTC(year, month, day)).toLocaleDateString() 
    }
	
}

/** Parses `YYYY-MM-DD` date strings */
export function parseHyphenatedDate(date: string): PartialDate {
	if (date.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/)) {
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
