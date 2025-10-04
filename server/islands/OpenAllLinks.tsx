import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';
import { Button } from '@/server/components/Button.tsx';
import type { EntityType } from '@kellnerd/musicbrainz/data/entity';
import { useSignal } from '@preact/signals';

export function OpenAllLinks({ mbEditLinks, entityType }: {
	mbEditLinks: string[];
	entityType: EntityType;
}) {
	const showBlockedPopUpWarning = useSignal(false);
	// Only show the button if there are multiple links to open.
	if (mbEditLinks.length <= 1) return null;

	function openAllLinks() {
		mbEditLinks.forEach((mbEditLink) => {
			if (mbEditLink) {
				const status = globalThis.open(mbEditLink, '_blank');
				if (!status && !showBlockedPopUpWarning.value) {
					// Show warning if the browser blocked the pop-up.
					showBlockedPopUpWarning.value = true;
				}
			}
		});
	}

	return (
		<>
			<div class='message'>
				<SpriteIcon name='external-link' />
				<div>
					<p>
						<Button class='open-all-links' onClick={openAllLinks}>
							Open all {entityType} links
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
