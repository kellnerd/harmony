import { IS_BROWSER } from 'fresh/runtime.ts';
import type { JSX } from 'preact';
import { type Signal, useSignal, useSignalEffect } from '@preact/signals';
import { setCookie } from '@/utils/cookie.ts';
import { isDefined } from '@/utils/predicate.ts';

function persistInStorage(key: string, value: Signal<string>) {
	// Try to get persisted input value from storage.
	const storedValue = localStorage.getItem(key);
	if (storedValue !== null) {
		value.value = storedValue;
	}

	// Persist input value every time it changes.
	useSignalEffect(() => localStorage.setItem(key, value.value));
}

function makeKey(...names: Array<string | undefined>) {
	return names.filter(isDefined).join('.');
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
	/** A namespace will be used to prefix the storage key of this input. */
	namespace?: string;
	/** Store the new value when the input changes. */
	storeChanges?: boolean;
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
	namespace,
	initialValue = false,
	trueValue = '1',
	falseValue = '0',
	formValue = '1',
	storeChanges = true,
	useCookie = false,
	...props
}: PersistentCheckboxProps) {
	const persistedValue = useSignal(initialValue ? trueValue : falseValue);
	if (IS_BROWSER) {
		persistInStorage(makeKey(namespace, id ?? name), persistedValue);
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
			onChange={storeChanges
				? ((event) => persistedValue.value = event.currentTarget.checked ? trueValue : falseValue)
				: undefined}
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
	namespace,
	initialValue = '',
	storeChanges = true,
	useCookie = false,
	...props
}: PersistentTextInputProps) {
	const text = useSignal(initialValue);
	if (IS_BROWSER) {
		persistInStorage(makeKey(namespace, id ?? name), text);
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
			onChange={storeChanges ? ((event) => text.value = event.currentTarget.value) : undefined}
		/>
	);
}
