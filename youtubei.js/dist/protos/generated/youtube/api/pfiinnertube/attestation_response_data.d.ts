import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface AttestationResponseData {
    challenge?: string | undefined;
    webResponse?: string | undefined;
    androidResponse?: string | undefined;
    iosResponse?: Uint8Array | undefined;
    error?: number | undefined;
    adblockReporting?: AttestationResponseData_AdblockReporting | undefined;
}
export interface AttestationResponseData_AdblockReporting {
    reportingStatus?: number | undefined;
    broadSpectrumDetectionResult?: number | undefined;
}
export declare const AttestationResponseData: MessageFns<AttestationResponseData>;
export declare const AttestationResponseData_AdblockReporting: MessageFns<AttestationResponseData_AdblockReporting>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
