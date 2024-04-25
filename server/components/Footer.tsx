import { codeRevisionUrl, codeUrl, shortRevision, supportUrl } from '@/server/config.ts';

export default function Footer() {
	return (
		<footer class='center'>
			<ul class='inline'>
				<li>
					Revision{' '}
					<a href={codeRevisionUrl?.href}>
						<code>{shortRevision}</code>
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
