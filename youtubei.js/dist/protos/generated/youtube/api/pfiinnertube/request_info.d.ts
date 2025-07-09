import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { KeyValuePair } from "../../../misc/common.js";
import { AttestationResponseData } from "./attestation_response_data.js";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface RequestInfo {
    thirdPartyDigest?: string | undefined;
    useSsl?: boolean | undefined;
    returnErrorDetail?: boolean | undefined;
    /** "If-None-Match" HTTP header? */
    ifNoneMatch?: string | undefined;
    returnLogEntry?: boolean | undefined;
    isPrefetch?: boolean | undefined;
    internalExperimentFlags: KeyValuePair[];
    returnDebugData?: boolean | undefined;
    innertubez?: string | undefined;
    traceProto?: boolean | undefined;
    returnLogEntryJson?: boolean | undefined;
    sherlogUsername?: string | undefined;
    /** repeated ConsistencyTokenJar consistency_token_jars = 26; */
    reauthRequestInfo?: RequestInfo_ReauthRequestInfo | undefined;
    sessionInfo?: RequestInfo_SessionInfo | undefined;
    returnLogEntryProto?: boolean | undefined;
    /** External pre-request context as a string */
    externalPrequestContext?: string | undefined;
    /**
     * repeated InnerTubeTokenJar innertube_token_jar = 33;
     * Would a botguard/droidguard response here allow playback?
     */
    attestationResponseData?: AttestationResponseData | undefined;
    eats?: Uint8Array | undefined;
    requestQos?: RequestInfo_RequestQoS | undefined;
}
export declare enum RequestInfo_Criticality {
    CRITICALITY_UNSPECIFIED = 0,
    CRITICALITY_CRITICAL = 1,
    CRITICALITY_NON_CRITICAL = 2,
    UNRECOGNIZED = -1
}
/** Quality of Service? */
export interface RequestInfo_RequestQoS {
    criticality?: RequestInfo_Criticality | undefined;
}
export interface RequestInfo_SessionInfo {
    token?: string | undefined;
}
export interface RequestInfo_ReauthRequestInfo {
    encodedReauthProofToken?: string | undefined;
}
export declare const RequestInfo: MessageFns<RequestInfo>;
export declare const RequestInfo_RequestQoS: MessageFns<RequestInfo_RequestQoS>;
export declare const RequestInfo_SessionInfo: MessageFns<RequestInfo_SessionInfo>;
export declare const RequestInfo_ReauthRequestInfo: MessageFns<RequestInfo_ReauthRequestInfo>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
