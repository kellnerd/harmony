export type MaybeArray<T> = T | T[];

export type MaybePromise<T> = T | Promise<T>;

export type FormDataRecord = Record<string, MaybeArray<string>>;

export type Key = string | number | symbol;

interface NestedRecord {
	[key: Key]: NestedRecord | MaybeArray<Key>;
}
