import type { ProviderMessage } from '../../harmonizer/types.ts';

export function MessageBox({ message }: { message: ProviderMessage }) {
	return (
		<div class={['message', message.type].join(' ')}>
			<p>
				{message.provider && <em class='provider'>{message.provider}:</em>}
				{message.text}
			</p>
		</div>
	);
}
