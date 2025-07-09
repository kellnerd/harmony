import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { InnerTubeContext } from "./innertube_context.js";
export declare const protobufPackage = "youtube.api.pfiinnertube";
export interface WatchNextRequest {
    context?: InnerTubeContext | undefined;
    videoId?: string | undefined;
    playlistId?: string | undefined;
    params?: string | undefined;
    continuation?: string | undefined;
    isAdPlayback?: boolean | undefined;
    mdxUseDevServer?: boolean | undefined;
    referrer?: string | undefined;
    referringApp?: string | undefined;
    adParams?: string | undefined;
    requestMusicSequence?: boolean | undefined;
    enableMdxAutoplay?: boolean | undefined;
    isMdxPlayback?: boolean | undefined;
    racyCheckOk?: boolean | undefined;
    contentCheckOk?: boolean | undefined;
    isAudioOnly?: boolean | undefined;
    autonavEnabled?: boolean | undefined;
    enablePersistentPlaylistPanel?: boolean | undefined;
    playlistSetVideoId?: string | undefined;
    showRuInvalidTokenMessage?: boolean | undefined;
    serializedThirdPartyEmbedConfig?: string | undefined;
    showContentOwnerOnly?: boolean | undefined;
    isEmbedPreview?: boolean | undefined;
    lastScrubbedInlinePlaybackVideoId?: string | undefined;
    lastAudioTurnedOnInlinePlaybackVideoId?: string | undefined;
    lastAudioTurnedOffInlinePlaybackVideoId?: string | undefined;
    captionsRequested?: boolean | undefined;
    queueContextParams?: Uint8Array | undefined;
    showShortsOnly?: boolean | undefined;
}
export declare const WatchNextRequest: MessageFns<WatchNextRequest>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
}
