import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "misc";
export interface HttpHeader {
    name?: string | undefined;
    value?: string | undefined;
}
export interface FormatId {
    itag?: number | undefined;
    lastModified?: number | undefined;
    xtags?: string | undefined;
}
export interface InitRange {
    start?: number | undefined;
    end?: number | undefined;
}
export interface IndexRange {
    start?: number | undefined;
    end?: number | undefined;
}
export interface KeyValuePair {
    key?: string | undefined;
    value?: string | undefined;
}
export interface FormatXTags {
    xtags: KeyValuePair[];
}
export declare const HttpHeader: MessageFns<HttpHeader>;
export declare const FormatId: MessageFns<FormatId>;
export declare const InitRange: MessageFns<InitRange>;
export declare const IndexRange: MessageFns<IndexRange>;
export declare const KeyValuePair: MessageFns<KeyValuePair>;
export declare const FormatXTags: MessageFns<FormatXTags>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
