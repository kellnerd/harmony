import MediaInfo from '../../core/mixins/MediaInfo.js';
import type NavigationEndpoint from '../classes/NavigationEndpoint.js';
import type PlayerOverlay from '../classes/PlayerOverlay.js';
import type { ApiResponse, Actions } from '../../core/index.js';
export default class ShortFormVideoInfo extends MediaInfo {
    #private;
    watch_next_feed?: NavigationEndpoint[];
    current_video_endpoint?: NavigationEndpoint;
    player_overlays?: PlayerOverlay;
    constructor(data: [ApiResponse, ApiResponse?], actions: Actions, cpn: string, reel_watch_sequence_response: ApiResponse);
    getWatchNextContinuation(): Promise<ShortFormVideoInfo>;
    /**
     * Checks if continuation is available for the watch next feed.
     */
    get wn_has_continuation(): boolean;
}
