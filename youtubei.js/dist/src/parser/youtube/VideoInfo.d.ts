import { MediaInfo } from '../../core/mixins/index.js';
import ChipCloud from '../classes/ChipCloud.js';
import ChipCloudChip from '../classes/ChipCloudChip.js';
import CommentsEntryPointHeader from '../classes/comments/CommentsEntryPointHeader.js';
import LiveChat from '../classes/LiveChat.js';
import MerchandiseShelf from '../classes/MerchandiseShelf.js';
import PlayerOverlay from '../classes/PlayerOverlay.js';
import TwoColumnWatchNextResults from '../classes/TwoColumnWatchNextResults.js';
import VideoPrimaryInfo from '../classes/VideoPrimaryInfo.js';
import VideoSecondaryInfo from '../classes/VideoSecondaryInfo.js';
import NavigationEndpoint from '../classes/NavigationEndpoint.js';
import LiveChatWrap from './LiveChat.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type Heatmap from '../classes/Heatmap.js';
export default class VideoInfo extends MediaInfo {
    #private;
    primary_info?: VideoPrimaryInfo | null;
    secondary_info?: VideoSecondaryInfo | null;
    playlist?: TwoColumnWatchNextResults['playlist'];
    game_info?: {
        title: import("../misc.js").Text | undefined;
        release_year: import("../misc.js").Text | undefined;
    } | undefined;
    merchandise?: MerchandiseShelf | null;
    related_chip_cloud?: ChipCloud | null;
    watch_next_feed?: ObservedArray<YTNode> | null;
    player_overlays?: PlayerOverlay | null;
    comments_entry_point_header?: CommentsEntryPointHeader | null;
    livechat?: LiveChat | null;
    autoplay?: TwoColumnWatchNextResults['autoplay'];
    heat_map?: Heatmap | null;
    constructor(data: [ApiResponse, ApiResponse?], actions: Actions, cpn: string);
    /**
     * Applies given filter to the watch next feed. Use {@link filters} to get available filters.
     * @param target_filter - Filter to apply.
     */
    selectFilter(target_filter: string | ChipCloudChip | undefined): Promise<VideoInfo>;
    /**
     * Adds video to the watch history.
     */
    addToWatchHistory(): Promise<Response>;
    /**
     * Updates watch time for the video.
     */
    updateWatchTime(startTime: number): Promise<Response>;
    /**
     * Retrieves watch next feed continuation.
     */
    getWatchNextContinuation(): Promise<VideoInfo>;
    /**
     * Likes the video.
     */
    like(): Promise<ApiResponse>;
    /**
     * Dislikes the video.
     */
    dislike(): Promise<ApiResponse>;
    /**
     * Removes like/dislike.
     */
    removeRating(): Promise<ApiResponse>;
    /**
     * Retrieves Live Chat if available.
     */
    getLiveChat(): LiveChatWrap;
    /**
     * Retrieves trailer info if available (typically for non-purchased movies or films).
     * @returns `VideoInfo` for the trailer, or `null` if none.
     */
    getTrailerInfo(): VideoInfo | null;
    /**
     * Watch next feed filters.
     */
    get filters(): string[];
    /**
     * Checks if continuation is available for the watch next feed.
     */
    get wn_has_continuation(): boolean;
    /**
     * Gets the endpoint of the autoplay video
     */
    get autoplay_video_endpoint(): NavigationEndpoint | null;
    /**
     * Checks if trailer is available.
     */
    get has_trailer(): boolean;
    /**
     * Get songs used in the video.
     */
    get music_tracks(): {
        song: string | undefined;
        artist: string | undefined;
        album: string | undefined;
        license: string | undefined;
        videoId: string | undefined;
        channelId: string | undefined;
    }[];
}
