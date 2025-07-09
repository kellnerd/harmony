import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface ServiceIntegrityDimensions {
    poToken?: Uint8Array | undefined;
}
export declare const ServiceIntegrityDimensions: MessageFns<ServiceIntegrityDimensions>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
