import type { JSX } from 'preact';

export default function InputWithOverlay(props: JSX.HTMLAttributes<HTMLInputElement>) {
	const overlay = props.children;
	delete props.children;

	return (
		<div class='input-with-overlay'>
			<div class='overlay'>
				{overlay}
			</div>
			<input type='text' {...props} />
		</div>
	);
}
