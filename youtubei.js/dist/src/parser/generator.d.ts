import { YTNode } from './helpers.js';
import * as Parser from './parser.js';
import NavigationEndpoint from './classes/NavigationEndpoint.js';
import type { YTNodeConstructor } from './helpers.js';
export type MiscInferenceType = {
    type: 'misc';
    misc_type: 'NavigationEndpoint';
    optional: boolean;
    endpoint: NavigationEndpoint;
} | {
    type: 'misc';
    misc_type: 'Text';
    optional: boolean;
    text: string;
    endpoint?: NavigationEndpoint;
} | {
    type: 'misc';
    misc_type: 'Thumbnail';
    optional: boolean;
} | {
    type: 'misc';
    misc_type: 'Author';
    optional: boolean;
    params: [string, string?];
};
export interface ObjectInferenceType {
    type: 'object';
    keys: KeyInfo;
    optional: boolean;
}
export interface RendererInferenceType {
    type: 'renderer';
    renderers: string[];
    optional: boolean;
}
export interface PrimitiveInferenceType {
    type: 'primitive';
    typeof: ('string' | 'number' | 'boolean' | 'bigint' | 'symbol' | 'undefined' | 'function' | 'never' | 'unknown')[];
    optional: boolean;
}
export type ArrayInferenceType = {
    type: 'array';
    array_type: 'primitive';
    items: PrimitiveInferenceType;
    optional: boolean;
} | {
    type: 'array';
    array_type: 'object';
    items: ObjectInferenceType;
    optional: boolean;
} | {
    type: 'array';
    array_type: 'renderer';
    renderers: string[];
    optional: boolean;
};
export type InferenceType = RendererInferenceType | MiscInferenceType | ObjectInferenceType | PrimitiveInferenceType | ArrayInferenceType;
export type KeyInfo = (readonly [string, InferenceType])[];
export declare function camelToSnake(str: string): string;
/**
 * Infer the type of key given its value
 * @param key - The key to infer the type of
 * @param value - The value of the key
 * @returns The inferred type
 */
export declare function inferType(key: string, value: unknown): InferenceType;
/**
 * Checks if the given value is an array of renderers
 * @param value - The value to check
 * @returns If it is a renderer list, return an object with keys being the classnames, and values being an example of that class.
 * Otherwise, return false.
 */
export declare function isRendererList(value: unknown): false | {
    [k: string]: any;
};
/**
 * Check if the given value is a misc type.
 * @param key - The key of the value
 * @param value - The value to check
 * @returns If it is a misc type, return the InferenceType. Otherwise, return false.
 */
export declare function isMiscType(key: string, value: unknown): MiscInferenceType | false;
/**
 * Check if the given value is a renderer
 * @param value - The value to check
 * @returns If it is a renderer, return the class name. Otherwise, return false.
 */
export declare function isRenderer(value: unknown): string | false;
/**
 * Checks if the given value is an array
 * @param value - The value to check
 * @returns If it is an array, return the InferenceType. Otherwise, return false.
 */
export declare function isArrayType(value: unknown): false | ArrayInferenceType;
/**
 * Introspect an example of a class in order to determine its key info and dependencies
 * @param classdata - The example of the class
 * @returns The key info and any unimplemented dependencies
 */
export declare function introspect(classdata: unknown): {
    key_info: (readonly [string, InferenceType])[];
    unimplemented_dependencies: [string, any][];
};
/**
 * Is this key ignored by the parser?
 * @param key - The key to check
 * @returns Whether or not the key is ignored
 */
export declare function isIgnoredKey(key: string | symbol): boolean;
/**
 * Given a classname and its resolved key info, create a new class
 * @param classname - The name of the class
 * @param key_info - The resolved key info
 * @param logger - The logger to log errors to
 * @returns Class based on the key info extending YTNode
 */
export declare function createRuntimeClass(classname: string, key_info: KeyInfo, logger: Parser.ParserErrorHandler): YTNodeConstructor;
/**
 * Given example data for a class, introspect, implement dependencies, and create a new class
 * @param classname - The name of the class
 * @param classdata - The example of the class
 * @param logger - The logger to log errors to
 * @returns Class based on the example classdata extending YTNode
 */
export declare function generateRuntimeClass(classname: string, classdata: unknown, logger: Parser.ParserErrorHandler): YTNodeConstructor<YTNode>;
/**
 * Generate a typescript class based on the key info
 * @param classname - The name of the class
 * @param key_info - The key info, as returned by {@link introspect}
 * @returns Typescript class file
 */
export declare function generateTypescriptClass(classname: string, key_info: KeyInfo): string;
/**
 * For a given inference type, get the typescript type declaration
 * @param inference_type - The inference type to get the declaration for
 * @param indentation - The indentation level (used for objects)
 * @returns Typescript type declaration
 */
export declare function toTypeDeclaration(inference_type: InferenceType, indentation?: number): string;
/**
 * Generate statements to parse a given inference type
 * @param key - The key to parse
 * @param inference_type - The inference type to parse
 * @param key_path - The path to the key (excluding the key itself)
 * @param indentation - The indentation level (used for objects)
 * @returns Statement to parse the given key
 */
export declare function toParser(key: string, inference_type: InferenceType, key_path?: string[], indentation?: number): string;
/**
 * Parse a value from a given key path using the given inference type
 * @param key - The key to parse
 * @param inference_type - The inference type to parse
 * @param data - The data to parse from
 * @param key_path - The path to the key (excluding the key itself)
 * @returns The parsed value
 */
export declare function parse(key: string, inference_type: InferenceType, data: unknown, key_path?: string[]): any;
/**
 * Merges two sets of key info, resolving any conflicts
 * @param key_info - The current key info
 * @param new_key_info - The new key info
 * @returns The merged key info
 */
export declare function mergeKeyInfo(key_info: KeyInfo, new_key_info: KeyInfo): {
    resolved_key_info: [string, InferenceType][];
    changed_keys: [string, InferenceType][];
};
