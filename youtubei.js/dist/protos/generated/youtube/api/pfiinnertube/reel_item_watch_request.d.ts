import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { InnerTubeContext } from "./innertube_context.js";
import { PlayerRequest } from "./player_request.js";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface ReelItemWatchRequest {
    context?: InnerTubeContext | undefined;
    playerRequest?: PlayerRequest | undefined;
    params?: string | undefined;
    disablePlayerResponse?: boolean | undefined;
}
export declare const ReelItemWatchRequest: MessageFns<ReelItemWatchRequest>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
