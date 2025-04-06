import { PersistentCheckbox, PersistentTextInput } from '@/server/islands/PersistentInput.tsx';
import type { ComponentChildren } from 'preact';

interface SettingRowProps<T> {
	/** Name of the setting, has to be unique. */
	name: string;
	/** Label of the text input. */
	label: string;
	/** Default value of the setting. */
	defaultValue?: T;
	/** Additionally store the value as cookie, making it available to the server. */
	useCookie?: boolean;
	/** Optional tooltip which is inserted after the label. */
	children?: ComponentChildren;
}

export function TextSettingRow({ name, label, defaultValue, useCookie, children }: SettingRowProps<string>) {
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

export function CheckboxSettingRow({ name, label, defaultValue, useCookie, children }: SettingRowProps<boolean>) {
	return (
		<div class='row'>
			<PersistentCheckbox
				name={name}
				id={name}
				initialValue={defaultValue}
				useCookie={useCookie}
			/>
			<label for={name}>{label}</label>
			{children}
		</div>
	);
}
