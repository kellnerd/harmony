import { codeUrl, revision } from '@/server/config.ts';

export default function Footer() {
	return (
		<footer class='center'>
			<p>
				<small>
					&copy; 2023-2024 David Kellner &bull; <a href={codeUrl}>Source</a> &bull; Revision
				</small>{' '}
				<code>{revision ?? 'unknown'}</code>
			</p>
		</footer>
	);
}
