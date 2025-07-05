import type { INextResponse, IPlayabilityStatus, IPlayerConfig, IPlayerResponse, IStreamingData } from '../../parser/index.js';
import { TranscriptInfo } from '../../parser/youtube/index.js';
import type { Actions, ApiResponse } from '../index.js';
import type { DownloadOptions, FormatFilter, FormatOptions, URLTransformer } from '../../types/index.js';
import type Format from '../../parser/classes/misc/Format.js';
import type { DashOptions } from '../../types/DashOptions.js';
import type { ObservedArray } from '../../parser/helpers.js';
import type CardCollection from '../../parser/classes/CardCollection.js';
import type Endscreen from '../../parser/classes/Endscreen.js';
import type PlayerAnnotationsExpanded from '../../parser/classes/PlayerAnnotationsExpanded.js';
import type PlayerCaptionsTracklist from '../../parser/classes/PlayerCaptionsTracklist.js';
import type PlayerLiveStoryboardSpec from '../../parser/classes/PlayerLiveStoryboardSpec.js';
import type PlayerStoryboardSpec from '../../parser/classes/PlayerStoryboardSpec.js';
export default class MediaInfo {
    #private;
    basic_info: {
        like_count: number | undefined;
        is_liked: boolean | undefined;
        is_disliked: boolean | undefined;
        embed: {
            iframe_url: string;
            flash_url: string;
            flash_secure_url: string;
            width: any;
            height: any;
        } | null | undefined;
        channel: {
            id: string;
            name: string;
            url: string;
        } | null;
        is_unlisted: boolean | undefined;
        is_family_safe: boolean | undefined;
        category: string | null;
        has_ypc_metadata: boolean | null;
        start_timestamp: Date | null;
        end_timestamp: Date | null;
        view_count: number | undefined;
        url_canonical: string | null;
        tags: string[] | null;
        id?: string | undefined;
        channel_id?: string | undefined;
        title?: string | undefined;
        duration?: number | undefined;
        keywords?: string[] | undefined;
        is_owner_viewing?: boolean | undefined;
        short_description?: string | undefined;
        thumbnail?: import("../../parser/misc.js").Thumbnail[] | undefined;
        allow_ratings?: boolean | undefined;
        author?: string | undefined;
        is_private?: boolean | undefined;
        is_live?: boolean | undefined;
        is_live_content?: boolean | undefined;
        is_live_dvr_enabled?: boolean | undefined;
        is_upcoming?: boolean | undefined;
        is_crawlable?: boolean | undefined;
        is_post_live_dvr?: boolean | undefined;
        is_low_latency_live_stream?: boolean | undefined;
        live_chunk_readahead?: number | undefined;
    };
    annotations?: ObservedArray<PlayerAnnotationsExpanded>;
    storyboards?: PlayerStoryboardSpec | PlayerLiveStoryboardSpec;
    endscreen?: Endscreen;
    captions?: PlayerCaptionsTracklist;
    cards?: CardCollection;
    streaming_data?: IStreamingData;
    playability_status?: IPlayabilityStatus;
    player_config?: IPlayerConfig;
    constructor(data: [ApiResponse, ApiResponse?], actions: Actions, cpn: string);
    /**
     * Generates a DASH manifest from the streaming data.
     * @param options
     * @returns DASH manifest
     */
    toDash(options?: {
        url_transformer?: URLTransformer;
        format_filter?: FormatFilter;
        include_thumbnails?: boolean;
        captions_format?: string;
        manifest_options?: DashOptions;
    }): Promise<string>;
    /**
     * Get a cleaned up representation of the adaptive_formats
     */
    getStreamingInfo(url_transformer?: URLTransformer, format_filter?: FormatFilter): import("../../utils/StreamingInfo.js").StreamingInfo;
    /**
     * Selects the format that best matches the given options.
     * @param options - Options
     */
    chooseFormat(options: FormatOptions): Format;
    /**
     * Downloads the video.
     * @param options - Download options.
     */
    download(options?: DownloadOptions): Promise<ReadableStream<Uint8Array>>;
    /**
     * Retrieves the video's transcript.
     */
    getTranscript(): Promise<TranscriptInfo>;
    addToWatchHistory(client_name?: string, client_version?: string, replacement?: string): Promise<Response>;
    updateWatchTime(startTime: number, client_name?: string, client_version?: string, replacement?: string): Promise<Response>;
    get actions(): Actions;
    /**
     * Content Playback Nonce.
     */
    get cpn(): string;
    /**
     * Parsed InnerTube response.
     */
    get page(): [IPlayerResponse, INextResponse?];
}
