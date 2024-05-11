import { IS_BROWSER } from 'fresh/runtime.ts';
import { useSignal, useSignalEffect } from '@preact/signals';

export interface PersistentCheckboxProps {
	/** Name of the form input. */
	name: string;
	/** ID of the HTML element. */
	id?: string;
	/** Initial value which will be used if the input has not been persisted so far. */
	initialValue?: boolean;
	/** String value which will be persisted for an unchecked input. */
	falseValue?: string;
	/** String value which will be used in forms and persisted for a checked input. */
	trueValue?: string;
}

export function PersistentCheckbox({
	name,
	id,
	initialValue = false,
	trueValue = '1',
	falseValue = '0',
}: PersistentCheckboxProps) {
	const checked = useSignal(initialValue);

	if (IS_BROWSER) {
		const storageKey = ['persist', id ?? name].join('.');

		// Try to get persisted input value from storage.
		const value = localStorage.getItem(storageKey);
		if (value !== null) {
			checked.value = value !== falseValue;
		}

		// Persist input value every time it changes.
		useSignalEffect(() => {
			localStorage.setItem(storageKey, checked.value ? trueValue : falseValue);
		});
	}

	return (
		<input
			type='checkbox'
			name={name}
			id={id}
			value={trueValue}
			checked={checked}
			onChange={(event) => checked.value = event.currentTarget.checked}
		/>
	);
}
