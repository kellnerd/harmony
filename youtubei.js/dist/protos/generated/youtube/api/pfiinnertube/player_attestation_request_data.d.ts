import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface PlayerAttestationRequestData {
    iosguardRequest?: PlayerAttestationRequestData_IosguardChallengeRequestData | undefined;
    omitBotguardData?: boolean | undefined;
}
export interface PlayerAttestationRequestData_IosguardChallengeRequestData {
    challengeRequest?: Uint8Array | undefined;
}
export declare const PlayerAttestationRequestData: MessageFns<PlayerAttestationRequestData>;
export declare const PlayerAttestationRequestData_IosguardChallengeRequestData: MessageFns<PlayerAttestationRequestData_IosguardChallengeRequestData>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
