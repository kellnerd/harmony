import { Button } from '@/server/components/Button.tsx';
import { SpriteIcon } from '@/server/components/SpriteIcon.tsx';
import { useSignal, useSignalEffect } from '@preact/signals';

export function CopyButton({ content, size }: {
	content: string;
	size?: number;
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
		<Button onClick={copyContent} title={'Copy to clipboard'}>
			<SpriteIcon name={isCopied.value ? 'copy-check' : 'copy'} size={size} />
		</Button>
	);
}
