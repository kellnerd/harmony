import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { KeyValuePair } from "../../../misc/common.js";
import { CapabilityInfo } from "./capability_info.js";
import { ClientInfo } from "./client_info.js";
import { RequestInfo } from "./request_info.js";
import { ThirdPartyInfo } from "./third_party_info.js";
import { UserInfo } from "./user_info.js";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface InnerTubeContext {
    client?: ClientInfo | undefined;
    user?: UserInfo | undefined;
    capabilities?: CapabilityInfo | undefined;
    request?: RequestInfo | undefined;
    clickTracking?: InnerTubeContext_ClickTrackingInfo | undefined;
    thirdParty?: ThirdPartyInfo | undefined;
    remoteClient?: ClientInfo | undefined;
    adSignalsInfo?: InnerTubeContext_AdSignalsInfo | undefined;
    experimentalData?: InnerTubeContext_ExperimentalData | undefined;
    clientScreenNonce?: string | undefined;
    activePlayers: InnerTubeContext_ActivePlayerInfo[];
}
export interface InnerTubeContext_ExperimentalData {
    params: KeyValuePair[];
}
export interface InnerTubeContext_ActivePlayerInfo {
    playerContextParams?: Uint8Array | undefined;
}
export interface InnerTubeContext_ClickTrackingInfo {
    clickTrackingParams?: Uint8Array | undefined;
}
export interface InnerTubeContext_AdSignalsInfo {
    params: KeyValuePair[];
    bid?: string | undefined;
    mutsuId?: string | undefined;
    consentBumpState?: string | undefined;
    advertisingId?: string | undefined;
    limitAdTracking?: boolean | undefined;
    attributionOsSupportedVersion?: string | undefined;
}
export declare const InnerTubeContext: MessageFns<InnerTubeContext>;
export declare const InnerTubeContext_ExperimentalData: MessageFns<InnerTubeContext_ExperimentalData>;
export declare const InnerTubeContext_ActivePlayerInfo: MessageFns<InnerTubeContext_ActivePlayerInfo>;
export declare const InnerTubeContext_ClickTrackingInfo: MessageFns<InnerTubeContext_ClickTrackingInfo>;
export declare const InnerTubeContext_AdSignalsInfo: MessageFns<InnerTubeContext_AdSignalsInfo>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
