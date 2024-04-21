import { defineApp } from 'fresh/server.ts';

export default defineApp((req, { Component }) => {
	// OpenGraph image URL must be absolute.
	const logoUrl = new URL('/harmony-logo.svg', req.url);

	return (
		<html lang='en'>
			<head>
				<meta charset='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Harmony</title>
				<meta name='description' content='Music Metadata Aggregator and MusicBrainz Importer' />
				<meta property='og:description' content='Music Metadata Aggregator and MusicBrainz Importer' />
				<meta property='og:image' content={logoUrl.href} />
				<link rel='stylesheet' href='/harmony.css' />
				<link rel='icon' href='/favicon.ico' sizes='48x48' />
				<link rel='icon' href='/favicon.svg' sizes='any' type='image/svg+xml' />
				<link rel='manifest' href='/site.webmanifest' />
			</head>
			<body>
				<Component />
			</body>
		</html>
	);
});
