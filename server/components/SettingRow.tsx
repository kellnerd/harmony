import { PersistentTextInput } from '@/server/islands/PersistentInput.tsx';
import type { ComponentChildren } from 'preact';

export function TextSettingRow({ name, label, defaultValue, useCookie, children }: {
	/** Name of the setting, has to be unique. */
	name: string;
	/** Label of the text input. */
	label: string;
	/** Default value of the setting. */
	defaultValue?: string;
	/** Additionally store the value as cookie, making it available to the server. */
	useCookie?: boolean;
	/** Tooltip which is inserted before the input. */
	children?: ComponentChildren;
}) {
	return (
		<div class='row'>
			<label class='col' for={name}>{label}:</label>
			{children ?? <span class='tooltip-anchor' />}
			<PersistentTextInput
				name={name}
				id={name}
				initialValue={defaultValue}
				useCookie={useCookie}
			/>
		</div>
	);
}
