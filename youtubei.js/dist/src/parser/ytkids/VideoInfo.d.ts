import { MediaInfo } from '../../core/mixins/index.js';
import PlayerOverlay from '../classes/PlayerOverlay.js';
import SlimVideoMetadata from '../classes/SlimVideoMetadata.js';
import type { ApiResponse, Actions } from '../../core/index.js';
import type { ObservedArray, YTNode } from '../helpers.js';
import type NavigationEndpoint from '../classes/NavigationEndpoint.js';
export default class VideoInfo extends MediaInfo {
    slim_video_metadata?: SlimVideoMetadata;
    watch_next_feed?: ObservedArray<YTNode>;
    current_video_endpoint?: NavigationEndpoint;
    player_overlays?: PlayerOverlay;
    constructor(data: [ApiResponse, ApiResponse?], actions: Actions, cpn: string);
}
