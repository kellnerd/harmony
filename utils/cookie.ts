export function setCookie(name: string, value: string | number | boolean, ...attributes: string[]) {
	const cookieString = [
		`${name}=${encodeURIComponent(value)}`,
		...attributes,
	].join('; ');
	document.cookie = cookieString;
}
