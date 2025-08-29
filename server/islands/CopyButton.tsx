import type { ExternalLink, HarmonyTrack } from '@/harmonizer/types.ts';
import { formatTracklist } from '@/musicbrainz/tracklist.ts';
import { Button } from '@/server/components/Button.tsx';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';
import { useSignal, useSignalEffect } from '@preact/signals';

export function CopyButton({ content, size, tooltip = 'Copy to clipboard' }: {
	content: string;
	size?: number;
	tooltip?: string;
}) {
	const isCopied = useSignal(false);

	async function copyContent() {
		try {
			await navigator.clipboard.writeText(content);
			isCopied.value = true;
		} catch (error) {
			isCopied.value = false;
			console.error(error);
		}
	}

	useSignalEffect(() => {
		if (isCopied.value) {
			// Reset copy indicator after a delay.
			const timerId = setTimeout(() => isCopied.value = false, 1000);
			return () => clearTimeout(timerId);
		}
	});

	return (
		<Button class='copy' onClick={copyContent} title={tooltip}>
			<SpriteIcon name={isCopied.value ? 'copy-check' : 'copy'} size={size ?? 18} />
		</Button>
	);
}

export function CopyLinksButton({ links }: { links: ExternalLink[] }) {
	return <CopyButton content={links.map((link) => link.url).join('\n')} />;
}

export function CopyTracklistButton({ tracks }: { tracks: HarmonyTrack[] }) {
	return <CopyButton content={formatTracklist(tracks)} tooltip='Copy tracklist to clipboard' />;
}
