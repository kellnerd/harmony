import { Jinter } from 'jintr';
import type { EmojiRun, TextRun } from '../parser/misc.js';
import type { FetchFunction } from '../types/index.js';
import type PlatformShim from '../types/PlatformShim.js';
import { Memo } from '../parser/helpers.js';
export declare class Platform {
    static load(platform: PlatformShim): void;
    static get shim(): PlatformShim;
}
export declare class InnertubeError extends Error {
    date: Date;
    version: string;
    info?: any;
    constructor(message: string, info?: any);
}
export declare class ParsingError extends InnertubeError {
}
export declare class MissingParamError extends InnertubeError {
}
export declare class OAuth2Error extends InnertubeError {
}
export declare class PlayerError extends Error {
}
export declare class SessionError extends Error {
}
export declare class ChannelError extends Error {
}
/**
 * Compares given objects. May not work correctly for
 * objects with methods.
 */
export declare function deepCompare(obj1: any, obj2: any): boolean;
/**
 * Finds a string between two delimiters.
 * @param data - the data.
 * @param start_string - start string.
 * @param end_string - end string.
 */
export declare function getStringBetweenStrings(data: string, start_string: string, end_string: string): string | undefined;
export declare function escapeStringRegexp(input: string): string;
export type DeviceCategory = 'mobile' | 'desktop';
/**
 * Returns a random user agent.
 * @param type - mobile | desktop
 */
export declare function getRandomUserAgent(type: DeviceCategory): string;
/**
 * Generates an authentication token from a cookies' sid.
 * @param sid - Sid extracted from cookies
 */
export declare function generateSidAuth(sid: string): Promise<string>;
/**
 * Generates a random string with the given length.
 *
 */
export declare function generateRandomString(length: number): string;
/**
 * Converts time (h:m:s) to seconds.
 * @returns seconds
 */
export declare function timeToSeconds(time: string): number;
export declare function concatMemos(...iterables: Array<Memo | undefined>): Memo;
export declare function throwIfMissing(params: object): void;
export declare function hasKeys<T extends object, R extends (keyof T)[]>(params: T, ...keys: R): params is Exclude<T, R[number]> & Required<Pick<T, R[number]>>;
export declare function streamToIterable(stream: ReadableStream<Uint8Array>): AsyncGenerator<Uint8Array, void, unknown>;
export declare const debugFetch: FetchFunction;
export declare function u8ToBase64(u8: Uint8Array): string;
export declare function base64ToU8(base64: string): Uint8Array;
export declare function isTextRun(run: TextRun | EmojiRun): run is TextRun;
export declare function getCookie(cookies: string, name: string, matchWholeName?: boolean): string | undefined;
export type ASTLookupArgs = {
    /**
     * The name of the function.
     */
    name?: string;
    /**
     * A string that must be included in the function's code for it to be considered.
     */
    includes?: string;
    /**
     * A regular expression that the function's code must match.
     */
    regexp?: RegExp;
    /**
     * The abstract syntax tree of the source code.
     */
    ast?: ReturnType<typeof Jinter.parseScript>;
};
export type ASTLookupResult = {
    start: number;
    end: number;
    name: string;
    node: Record<string, any>;
    result: string;
};
/**
 * Searches for a function in the given code based on specified criteria.
 *
 * @example
 * ```ts
 * const source = '(function() {var foo, bar; foo = function() { console.log("foo"); }; bar = function() { console.log("bar"); }; })();';
 * const result = findFunction(source, { name: 'bar' });
 * console.log(result);
 * // Output: { start: 69, end: 110, name: 'bar', node: { ... }, result: 'bar = function() { console.log("bar"); };' }
 * ```
 *
 * @returns An object containing the function's details if found, `undefined` otherwise.
 */
export declare function findFunction(source: string, args: ASTLookupArgs): ASTLookupResult | undefined;
/**
 * Searches for a variable declaration in the given code based on specified criteria.
 *
 * @example
 * ```ts
 * // Find a variable by name
 * const code = 'const x = 5; let y = "hello";';
 * const a = findVariable(code, { name: 'y' });
 * console.log(a?.result);
 *
 * // Find a variable containing specific text
 * const b = findVariable(code, { includes: 'hello' });
 * console.log(b?.result);
 *
 * // Find a variable matching a pattern
 * const c = findVariable(code, { regexp: /y\s*=\s*"hello"/ });
 * console.log(c?.result);
 * ```
 *
 * @returns An object containing the variable's details if found, `undefined` otherwise.
 */
export declare function findVariable(code: string, options: ASTLookupArgs): ASTLookupResult | undefined;
