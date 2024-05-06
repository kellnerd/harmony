import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';
import { codeRevisionUrl, codeUrl, shortRevision, supportUrl } from '@/server/config.ts';

export default function Footer() {
	return (
		<footer class='center'>
			<ul class='inline'>
				<li>
					<span title='Source Code'>
						<SpriteIcon name='brand-git' size={16} stroke={1.5} /> <a href={codeUrl.href}>Source</a>
					</span>
				</li>
				<li>
					<a href={codeRevisionUrl?.href} title='Revision'>
						<code>{shortRevision}</code>
					</a>
				</li>
				<li>
					<a href={supportUrl.href}>Support</a>
				</li>
			</ul>
		</footer>
	);
}
