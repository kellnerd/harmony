// deno-lint-ignore-file no-explicit-any

/** Test specification with tuples of description and parameters for the function to test. */
export type ParameterSpec<T extends (...args: any) => any> = Array<[
	description: string,
	...params: Parameters<T>,
]>;

/** Test specification with tuples of description, parameters and expected result for the function to test. */
export type FunctionSpec<T extends (...args: any) => any> = Array<[
	description: string,
	...params: Parameters<T>,
	expected: ReturnType<T>,
]>;
