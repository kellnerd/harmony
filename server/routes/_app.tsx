import type { PageProps } from 'fresh/server.ts';

export default function App({ Component }: PageProps) {
	return (
		<html>
			<head>
				<meta charset='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Harmony</title>
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
}
