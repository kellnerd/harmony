import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';
import { Button } from '@/server/components/Button.tsx';
import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import { useSignal } from '@preact/signals';

/**
 * Delay between every pop-up, in milliseconds.
 */
const popUpDelay = 300;
const blockedPopUpMessage = 'Pop-up was blocked';

export function OpenAllLinks({ mbEditLinks, entityType }: {
	mbEditLinks: string[];
	entityType: EntityType;
}) {
	const showBlockedPopUpWarning = useSignal(false);
	const numberOfLinks = mbEditLinks.length;
	// Only show the button if there are multiple links to open.
	if (numberOfLinks <= 1) return null;

	async function openAllLinks() {
		if (numberOfLinks >= 10 && !globalThis.confirm(`This will open ${numberOfLinks} new tabs. Continue?`)) return;

		const controller = new AbortController();
		const signal = controller.signal;

		const newWindowPromises = mbEditLinks.map((mbEditLink, index) =>
			new Promise<void>((resolve, reject) => {
				if (!mbEditLink) return resolve();

				const timeoutId = setTimeout(() => {
					const newWindow = globalThis.open(mbEditLink, '_blank');
					const isBlocked = !newWindow || newWindow.closed || typeof newWindow.closed === 'undefined';

					if (isBlocked) {
						// If the pop-up was blocked, reject the promise with a specific message.
						return reject(new Error(blockedPopUpMessage));
					}

					return resolve();
				}, index * popUpDelay);

				// If the controller is aborted, clear the timeout and reject the promise.
				signal.addEventListener('abort', () => {
					clearTimeout(timeoutId);
					reject();
				});
			})
		);

		try {
			await Promise.all(newWindowPromises);
			// If all pop-ups were opened, hide warning if it was visible.
			showBlockedPopUpWarning.value = false;
		} catch (error) {
			if (error instanceof Error && error.message === blockedPopUpMessage) {
				// Abort all pending pop-ups.
				controller.abort();
				// Show warning if the browser blocked the pop-up.
				showBlockedPopUpWarning.value = true;
			}
		}
	}

	return (
		<>
			<div class='message'>
				<SpriteIcon name='external-link' />
				<div>
					<p>
						<Button
							class='open-all-links'
							onClick={openAllLinks}
							title={`This will open ${numberOfLinks} tabs (pop-up)`}
						>
							Open all {numberOfLinks} {entityType} links
						</Button>
					</p>
				</div>
			</div>
			{showBlockedPopUpWarning.value && (
				<div class='message warning'>
					<SpriteIcon name='alert-triangle' />
					<div>
						<p>
							Your browser may have blocked the pop-ups. Please allow pop-ups for this site and try again.
						</p>
					</div>
				</div>
			)}
		</>
	);
}
