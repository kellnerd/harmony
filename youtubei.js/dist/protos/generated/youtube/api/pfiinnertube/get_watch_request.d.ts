import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { InnerTubeContext } from "./innertube_context.js";
import { PlayerRequest } from "./player_request.js";
import { ReelItemWatchRequest } from "./reel_item_watch_request.js";
import { WatchNextRequest } from "./watch_next_request.js";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface GetWatchRequest {
    context?: InnerTubeContext | undefined;
    playerRequest?: PlayerRequest | undefined;
    watchNextRequest?: WatchNextRequest | undefined;
    reelItemWatchRequest?: ReelItemWatchRequest | undefined;
}
export declare const GetWatchRequest: MessageFns<GetWatchRequest>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
