import type { ProviderMessage } from '../../harmonizer/types.ts';

export function MessageBox({ message }: { message: ProviderMessage }) {
	return (
		<div class={['message', message.type].join(' ')}>
			<p>
				{message.provider && <span class='provider'>{message.provider}:</span>}
				{message.text}
			</p>
		</div>
	);
}
