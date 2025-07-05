import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface PlayerRequestCaptionParams {
    deviceCaptionsOn?: boolean | undefined;
    deviceCaptionsLangPref?: string | undefined;
    viewerSelectedCaptionLangs?: string | undefined;
    ccLangPref?: string | undefined;
    ccLoadPolicyOn?: boolean | undefined;
}
export declare const PlayerRequestCaptionParams: MessageFns<PlayerRequestCaptionParams>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
