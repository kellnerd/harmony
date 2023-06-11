export default function Footer() {
	const revision = Deno.env.get('DENO_DEPLOYMENT_ID');

	return (
		<footer class='center'>
			<p>
				<small>Copyright &copy; 2023 David Kellner &bull; Revision</small> <code>{revision ?? 'unknown'}</code>
			</p>
		</footer>
	);
}
