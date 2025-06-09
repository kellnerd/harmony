/** Joins the given CSS classes, omitting all falsy values. */
export function classList(...classes: Array<string | false | undefined>): string {
	return classes.filter(Boolean).join(' ');
}
