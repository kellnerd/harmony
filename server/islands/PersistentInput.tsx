import { IS_BROWSER } from 'fresh/runtime.ts';
import type { JSX } from 'preact';
import { type Signal, useSignal, useSignalEffect } from '@preact/signals';
import { setCookie } from '@/utils/cookie.ts';

function persistInStorage(key: string, value: Signal<string>) {
	const storageKey = ['persist', key].join('.');

	// Try to get persisted input value from storage.
	const storedValue = localStorage.getItem(storageKey);
	if (storedValue !== null) {
		value.value = storedValue;
	}

	// Persist input value every time it changes.
	useSignalEffect(() => localStorage.setItem(storageKey, value.value));
}

function persistAsCookie(name: string, value: Signal<string>) {
	// Set persistent cookie (for 1 year) every time the value changes.
	useSignalEffect(() => setCookie(name, value.value, 'Max-Age=31536000', 'SameSite=Lax'));
}

export interface PersistentInputProps extends JSX.HTMLAttributes<HTMLInputElement> {
	/** Name of the form input. */
	name: string;
	/** ID of the HTML element. */
	id?: string;
	/** Store the value as cookie, making it available to the server. */
	useCookie?: boolean;
}

export interface PersistentCheckboxProps extends PersistentInputProps {
	/** Initial value which will be used if the input has not been persisted so far. */
	initialValue?: boolean;
	/** String value which will be persisted for an unchecked input. */
	falseValue?: string;
	/** String value which will be persisted for a checked input. */
	trueValue?: string;
	/** String value which will be used in forms for a checked input. */
	formValue?: string;
}

export function PersistentCheckbox({
	name,
	id,
	initialValue = false,
	trueValue = '1',
	falseValue = '0',
	formValue = '1',
	useCookie = false,
	...props
}: PersistentCheckboxProps) {
	const persistedValue = useSignal(initialValue ? trueValue : falseValue);
	if (IS_BROWSER) {
		persistInStorage(id ?? name, persistedValue);
		// Temporary migration from old true value (form value) to the cookie-compatible new one.
		// TODO: Remove the following code block again after a while.
		if (persistedValue.peek() === formValue) {
			persistedValue.value = trueValue;
		}
		if (useCookie) {
			persistAsCookie(name, persistedValue);
		}
	}

	return (
		<input
			type='checkbox'
			name={name}
			id={id}
			{...props}
			value={formValue}
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
	useCookie = false,
	...props
}: PersistentTextInputProps) {
	const text = useSignal(initialValue);
	if (IS_BROWSER) {
		persistInStorage(id ?? name, text);
		if (useCookie) {
			persistAsCookie(name, text);
		}
	}

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
