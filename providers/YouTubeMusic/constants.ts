export const BROWSE_URL = new URL('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false&alt=json');
export const SEARCH_URL = new URL('https://www.youtube.com/youtubei/v1/search?prettyPrint=false&alt=json');

export const USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';

export const YOUTUBEI_HEADERS = {
	accept: '*/*',
	'accept-language': '*',
	'content-type': 'application/json',
	origin: 'https://www.youtube.com',
	'user-agent': USER_AGENT,
	'x-youtube-client-name': '67',
	'x-youtube-client-version': '1.20250219.01.00',
};

export const YOUTUBEI_BODY = {
	isAudioOnly: true,
	context: {
		client: {
			hl: 'en',
			gl: 'US',
			screenDensityFloat: 1,
			screenHeightPoints: 1440,
			screenPixelDensity: 1,
			screenWidthPoints: 2560,
			clientName: 'WEB_REMIX',
			clientVersion: '1.20250219.01.00',
			osName: 'Windows',
			osVersion: '10.0',
			userAgent:
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
			platform: 'DESKTOP',
			clientFormFactor: 'UNKNOWN_FORM_FACTOR',
			userInterfaceTheme: 'USER_INTERFACE_THEME_LIGHT',
			timeZone: 'Europe/Berlin',
			originalUrl: 'https://www.youtube.com',
			deviceMake: '',
			deviceModel: '',
			browserName: 'Edge Chromium',
			browserVersion: '109.0.1518.61',
			utcOffsetMinutes: 120,
			memoryTotalKbytes: '8000000',
			mainAppWebInfo: {
				graftUrl: 'https://www.youtube.com',
				pwaInstallabilityStatus: 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
				webDisplayMode: 'WEB_DISPLAY_MODE_BROWSER',
				isWebNativeShareAvailable: true,
			},
		},
		user: { enableSafetyMode: false, lockedSafetyMode: false },
		request: { useSsl: true, internalExperimentFlags: [] },
	},
};
