import { AppProps } from 'fresh/server.ts';

export default function App({ Component }: AppProps) {
	return (
		<html>
			<head>
				<meta charset='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>Harmony</title>
				<link rel='stylesheet' href='harmony.css' />
			</head>
			<body>
				<Component />
			</body>
		</html>
	);
}
