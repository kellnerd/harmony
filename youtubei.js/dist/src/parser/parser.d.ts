import * as YTNodes from './nodes.js';
import type { ObservedArray, YTNode, YTNodeConstructor } from './helpers.js';
import { Memo, SuperParsedResult } from './helpers.js';
import type { KeyInfo } from './generator.js';
import { Continuation, ContinuationCommand, GridContinuation, ItemSectionContinuation, LiveChatContinuation, MusicPlaylistShelfContinuation, MusicShelfContinuation, NavigateAction, PlaylistPanelContinuation, ReloadContinuationItemsCommand, SectionListContinuation, ShowMiniplayerCommand } from './continuations.js';
import Format from './classes/misc/Format.js';
import type { IParsedResponse, IRawResponse, RawData, RawNode } from './types/index.js';
export type ParserError = {
    classname: string;
} & ({
    error_type: 'typecheck';
    classdata: RawNode;
    expected: string | string[];
} | {
    error_type: 'parse';
    classdata: RawNode;
    error: unknown;
} | {
    error_type: 'mutation_data_missing';
    classname: string;
} | {
    error_type: 'mutation_data_invalid';
    total: number;
    failed: number;
    titles: string[];
} | {
    error_type: 'class_not_found';
    key_info: KeyInfo;
} | {
    error_type: 'class_changed';
    key_info: KeyInfo;
    changed_keys: KeyInfo;
});
export type ParserErrorHandler = (error: ParserError) => void;
export declare function setParserErrorHandler(handler: ParserErrorHandler): void;
export declare function shouldIgnore(classname: string): boolean;
export declare function sanitizeClassName(input: string): string;
export declare function getParserByName(classname: string): YTNodeConstructor<YTNode>;
export declare function hasParser(classname: string): boolean;
export declare function addRuntimeParser(classname: string, ParserConstructor: YTNodeConstructor): void;
export declare function getDynamicParsers(): {
    [k: string]: YTNodeConstructor<YTNode>;
};
/**
 * Parses a given InnerTube response.
 * @param data - Raw data.
 */
export declare function parseResponse<T extends IParsedResponse = IParsedResponse>(data: IRawResponse): T;
/**
 * Parses an item.
 * @param data - The data to parse.
 * @param validTypes - YTNode types that are allowed to be parsed.
 */
export declare function parseItem<T extends YTNode, K extends YTNodeConstructor<T>[]>(data: RawNode | undefined, validTypes: K): InstanceType<K[number]> | null;
export declare function parseItem<T extends YTNode>(data: RawNode | undefined, validTypes: YTNodeConstructor<T>): T | null;
export declare function parseItem(data?: RawNode): YTNode;
/**
 * Parses an array of items.
 * @param data - The data to parse.
 * @param validTypes - YTNode types that are allowed to be parsed.
 */
export declare function parseArray<T extends YTNode, K extends YTNodeConstructor<T>[]>(data: RawNode[] | undefined, validTypes: K): ObservedArray<InstanceType<K[number]>>;
export declare function parseArray<T extends YTNode = YTNode>(data: RawNode[] | undefined, validType: YTNodeConstructor<T>): ObservedArray<T>;
export declare function parseArray(data: RawNode[] | undefined): ObservedArray<YTNode>;
/**
 * Parses an item or an array of items.
 * @param data - The data to parse.
 * @param requireArray - Whether the data should be parsed as an array.
 * @param validTypes - YTNode types that are allowed to be parsed.
 */
export declare function parse<T extends YTNode, K extends YTNodeConstructor<T>[]>(data: RawData, requireArray: true, validTypes?: K): ObservedArray<InstanceType<K[number]>> | null;
export declare function parse<T extends YTNode, K extends YTNodeConstructor<T>>(data: RawData, requireArray: true, validTypes?: K): ObservedArray<InstanceType<K>> | null;
export declare function parse<T extends YTNode = YTNode>(data?: RawData, requireArray?: false | undefined, validTypes?: YTNodeConstructor<T> | YTNodeConstructor<T>[]): SuperParsedResult<T>;
/**
 * Parses an InnerTube command and returns a YTNode instance if applicable.
 * @param data - The raw node data to parse
 * @returns A YTNode instance if parsing is successful, undefined otherwise
 */
export declare function parseCommand(data: RawNode): YTNode | undefined;
/**
 * Parses an array of InnerTube command nodes.
 * @param commands - Array of raw command nodes to parse
 * @returns An observed array of parsed YTNodes
 */
export declare function parseCommands(commands?: RawNode[]): ObservedArray<YTNode>;
export declare function parseC(data: RawNode): Continuation | null;
export declare function parseLC(data: RawNode): ItemSectionContinuation | SectionListContinuation | LiveChatContinuation | MusicPlaylistShelfContinuation | MusicShelfContinuation | GridContinuation | PlaylistPanelContinuation | ContinuationCommand | null;
export declare function parseRR(actions: RawNode[]): ObservedArray<YTNodes.AppendContinuationItemsAction | YTNodes.OpenPopupAction | NavigateAction | ShowMiniplayerCommand | ReloadContinuationItemsCommand>;
export declare function parseActions(data: RawData): SuperParsedResult<YTNode>;
export declare function parseFormats(formats: RawNode[], this_response_nsig_cache: Map<string, string>): Format[];
export declare function applyMutations(memo: Memo, mutations: RawNode[]): void;
export declare function applyCommentsMutations(memo: Memo, mutations: RawNode[]): void;
