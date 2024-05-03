import { Markdown } from './Markdown.tsx';
import { ProviderIcon } from './ProviderIcon.tsx';
import { SpriteIcon } from './SpriteIcon.tsx';

import type { MessageType, ProviderMessage } from '@/harmonizer/types.ts';

const massageIconMap: Record<MessageType, string> = {
	debug: 'bug',
	error: 'alert-triangle',
	info: 'info-circle',
	warning: 'alert-triangle',
};

export function MessageBox({ message }: { message: ProviderMessage }) {
	const iconName = massageIconMap[message.type];

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
