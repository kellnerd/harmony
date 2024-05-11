import { IS_BROWSER } from 'fresh/runtime.ts';
import { useSignal, useSignalEffect } from '@preact/signals';

export function PersistentCheckbox({ name, id, defaultValue = false, trueValue = '1', falseValue = '0' }: {
	name: string;
	id?: string;
	defaultValue?: boolean;
	falseValue?: string;
	trueValue?: string;
}) {
	const checked = useSignal(defaultValue);

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
