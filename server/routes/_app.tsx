import type { PageProps } from 'fresh/server.ts';

export default function App({ Component }: PageProps) {
	return (
		<html>
			<head>
				<meta charset='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Harmony</title>
				<link rel='stylesheet' href='/harmony.css' />
				<link rel='icon' type='image/svg+xml' href='/favicon.svg' />
				<link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
				<link rel='manifest' href='/site.webmanifest' />
			</head>
			<body>
				<Component />
			</body>
		</html>
	);
}
