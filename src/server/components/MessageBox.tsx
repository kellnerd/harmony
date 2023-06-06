import IconAlertTriangle from 'tabler-icons/alert-triangle.tsx';
import IconBug from 'tabler-icons/bug.tsx';
import IconInfoCircle from 'tabler-icons/info-circle.tsx';

import type { MessageType, ProviderMessage } from '../../harmonizer/types.ts';
import type { JSX } from 'preact';

const icons: Record<MessageType, JSX.Element> = {
	debug: <IconBug />,
	error: <IconAlertTriangle />,
	info: <IconInfoCircle />,
	warning: <IconAlertTriangle />,
};

export function MessageBox({ message }: { message: ProviderMessage }) {
	return (
		<div class={['message', message.type].join(' ')}>
			{icons[message.type]}
			{message.provider && <span class='provider'>{message.provider}:</span>}
			{message.text}
		</div>
	);
}
