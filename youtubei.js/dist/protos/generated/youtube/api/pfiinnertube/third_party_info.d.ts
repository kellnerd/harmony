import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface ThirdPartyInfo {
    developerKey?: string | undefined;
    appName?: string | undefined;
    appPublisher?: string | undefined;
    embedUrl?: string | undefined;
    appVersion?: string | undefined;
    embeddedPlayerContext?: ThirdPartyInfo_EmbeddedPlayerContext | undefined;
}
export interface ThirdPartyInfo_EmbeddedPlayerContext {
    ancestorOrigins?: string | undefined;
    embeddedPlayerEncryptedContext?: string | undefined;
    ancestorOriginsSupported?: boolean | undefined;
}
export declare const ThirdPartyInfo: MessageFns<ThirdPartyInfo>;
export declare const ThirdPartyInfo_EmbeddedPlayerContext: MessageFns<ThirdPartyInfo_EmbeddedPlayerContext>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
