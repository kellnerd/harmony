import { Markdown } from './Markdown.tsx';
import { ProviderIcon } from './ProviderIcon.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import type { MessageType, ProviderMessage } from '@/harmonizer/types.ts';
import { CompatibilityError, ProviderError } from '@/utils/errors.ts';

const messageIconMap: Record<MessageType, string> = {
	debug: 'bug',
	error: 'alert-triangle',
	info: 'info-circle',
	warning: 'alert-triangle',
};

export function MessageBox({ message }: { message: ProviderMessage }) {
	const iconName = messageIconMap[message.type];

	return (
		<div class={['message', message.type].join(' ')}>
			<SpriteIcon name={iconName} />
			{message.provider && (
				<>
					<ProviderIcon providerName={message.provider} />
					<span class='provider'>{message.provider}:</span>
				</>
			)}
			<Markdown content={message.text} />
		</div>
	);
}

export function ErrorMessageBox({ error, currentUrl }: { error: Error; currentUrl?: URL }) {
	let { message } = error;
	if (error instanceof CompatibilityError) {
		if (currentUrl) {
			message += `:\n- ${error.makeAlternativeLinks(currentUrl).join('\n- ')}`;
		} else {
			message += `: ${error.details.join(', ')}`;
		}
	}
	return (
		<MessageBox
			message={{
				provider: error instanceof ProviderError ? error.providerName : undefined,
				text: message,
				type: 'error',
			}}
		/>
	);
}
