export function NavigationBar() {
	return (
		<nav class='sticky'>
			<ul>
				<li>
					<a href='/'>
						<img src='/harmony-logo.svg' class='icon-logo' alt='Logo' />
						<span>Harmony</span>
					</a>
				</li>
				<li>
					<a href='/release'>Release Lookup</a>
				</li>
				<li>
					<a href='/settings'>Settings</a>
				</li>
			</ul>
		</nav>
	);
}
