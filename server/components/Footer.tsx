import { codeRevisionUrl, codeUrl, revision, supportUrl } from '@/server/config.ts';

export default function Footer() {
	return (
		<footer class='center'>
			<ul class='inline'>
				<li>
					Revision{' '}
					<a href={codeRevisionUrl?.href}>
						<code>{revision?.substring(0, 7) ?? 'unknown'}</code>
					</a>
				</li>
				<li>
					<a href={codeUrl.href}>Source</a>
				</li>
				<li>
					<a href={supportUrl.href}>Support</a>
				</li>
			</ul>
		</footer>
	);
}
