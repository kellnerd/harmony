export const BROWSE_URL = new URL('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false&alt=json');
export const SEARCH_URL = new URL('https://www.youtube.com/youtubei/v1/search?prettyPrint=false&alt=json');

export const USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';

const CLIENT_VERSION = '1.20250219.01.00';

export const YOUTUBEI_HEADERS = {
	accept: '*/*',
	'accept-language': '*',
	'content-type': 'application/json',
	origin: 'https://www.youtube.com',
	'user-agent': USER_AGENT,
	'x-youtube-client-name': '67',
	'x-youtube-client-version': CLIENT_VERSION,
};

export const YOUTUBEI_BODY = {
	context: {
		client: {
			hl: 'en',
			gl: 'US',
			clientName: 'WEB_REMIX',
			clientVersion: CLIENT_VERSION,
		},
	},
};
