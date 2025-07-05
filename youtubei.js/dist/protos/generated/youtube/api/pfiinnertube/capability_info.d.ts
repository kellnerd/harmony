import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface CapabilityInfo {
    profile?: string | undefined;
    supportedCapabilities: InnerTubeCapability[];
    disabledCapabilities: InnerTubeCapability[];
    snapshot?: string | undefined;
}
export interface InnerTubeCapability {
    capability?: number | undefined;
    features?: number | undefined;
    experimentFlags?: string | undefined;
}
export declare const CapabilityInfo: MessageFns<CapabilityInfo>;
export declare const InnerTubeCapability: MessageFns<InnerTubeCapability>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
