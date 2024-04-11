export default function Footer() {
	const revision = Deno.env.get('DENO_DEPLOYMENT_ID');
	const codeUrl = Deno.env.get('HARMONY_CODE_URL') || 'https://github.com/kellnerd/harmony';

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
