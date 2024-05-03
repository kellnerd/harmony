import { Markdown } from './Markdown.tsx';
import { ProviderIcon } from './ProviderIcon.tsx';
import IconAlertTriangle from 'tabler-icons/alert-triangle.tsx';
import IconBug from 'tabler-icons/bug.tsx';
import IconInfoCircle from 'tabler-icons/info-circle.tsx';

import type { MessageType, ProviderMessage } from '@/harmonizer/types.ts';

type Icon = typeof IconBug;

const massageIconMap: Record<MessageType, Icon> = {
	debug: IconBug,
	error: IconAlertTriangle,
	info: IconInfoCircle,
	warning: IconAlertTriangle,
};

export function MessageBox({ message }: { message: ProviderMessage }) {
	const icon = massageIconMap[message.type];

	return (
		<div class={['message', message.type].join(' ')}>
			{icon({})}
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
