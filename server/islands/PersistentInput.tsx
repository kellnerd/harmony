import { IS_BROWSER } from 'fresh/runtime.ts';
import type { JSX } from 'preact';
import { useSignal, useSignalEffect } from '@preact/signals';

function usePersisted(key: string, initialValue: string) {
	const value = useSignal(initialValue);

	if (IS_BROWSER) {
		const storageKey = ['persist', key].join('.');

		// Try to get persisted input value from storage.
		const storedValue = localStorage.getItem(storageKey);
		if (storedValue !== null) {
			value.value = storedValue;
		}

		// Persist input value every time it changes.
		useSignalEffect(() => localStorage.setItem(storageKey, value.value));
	}

	return value;
}

export interface PersistentInputProps extends JSX.HTMLAttributes<HTMLInputElement> {
	/** Name of the form input. */
	name: string;
	/** ID of the HTML element. */
	id?: string;
}

export interface PersistentCheckboxProps extends PersistentInputProps {
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
	...props
}: PersistentCheckboxProps) {
	const persistedValue = usePersisted(id ?? name, initialValue ? trueValue : falseValue);

	return (
		<input
			type='checkbox'
			name={name}
			id={id}
			{...props}
			value={trueValue}
			checked={persistedValue.value !== falseValue}
			onChange={(event) => persistedValue.value = event.currentTarget.checked ? trueValue : falseValue}
		/>
	);
}

export interface PersistentTextInputProps extends PersistentInputProps {
	/** Initial value which will be used if the input has not been persisted so far. */
	initialValue?: string;
}

export function PersistentTextInput({
	name,
	id,
	initialValue = '',
	...props
}: PersistentTextInputProps) {
	const text = usePersisted(id ?? name, initialValue);

	return (
		<input
			type='text'
			name={name}
			id={id}
			{...props}
			value={text}
			onChange={(event) => text.value = event.currentTarget.value}
		/>
	);
}
