import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { InnerTubeContext } from "./innertube_context.js";
import { PlaybackContext } from "./playback_context.js";
import { PlayerAttestationRequestData } from "./player_attestation_request_data.js";
import { PlayerRequestCaptionParams } from "./player_request_caption_params.js";
import { ServiceIntegrityDimensions } from "./service_integrity_dimensions.js";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface PlayerRequest {
    context?: InnerTubeContext | undefined;
    videoId?: string | undefined;
    contentCheckOk?: boolean | undefined;
    playbackContext?: PlaybackContext | undefined;
    racyCheckOk?: boolean | undefined;
    id?: string | undefined;
    t?: string | undefined;
    forOffline?: boolean | undefined;
    playlistId?: string | undefined;
    playlistIndex?: number | undefined;
    startTimeSecs?: number | undefined;
    params?: string | undefined;
    offlineSharingWrappedKey?: Uint8Array | undefined;
    attestationRequest?: PlayerAttestationRequestData | undefined;
    referringApp?: string | undefined;
    referrer?: string | undefined;
    serializedThirdPartyEmbedConfig?: string | undefined;
    proxiedByOnesie?: boolean | undefined;
    hostAppToken?: string | undefined;
    cpn?: string | undefined;
    overrideMutedAtStart?: boolean | undefined;
    captionParams?: PlayerRequestCaptionParams | undefined;
    serviceIntegrityDimensions?: ServiceIntegrityDimensions | undefined;
    /** optional VideoQualitySetting video_quality_setting_params = 28; */
    deferredPlayerToken?: Uint8Array | undefined;
}
export declare const PlayerRequest: MessageFns<PlayerRequest>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
