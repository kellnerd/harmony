import { MediaInfo } from '../../core/mixins/index.js';
import ItemSection from '../classes/ItemSection.js';
import PlayerOverlay from '../classes/PlayerOverlay.js';
import SlimVideoMetadata from '../classes/SlimVideoMetadata.js';
import TwoColumnWatchNextResults from '../classes/TwoColumnWatchNextResults.js';
export default class VideoInfo extends MediaInfo {
    constructor(data, actions, cpn) {
        super(data, actions, cpn);
        const next = this.page[1];
        const two_col = next?.contents?.item().as(TwoColumnWatchNextResults);
        const results = two_col?.results;
        const secondary_results = two_col?.secondary_results;
        if (results && secondary_results) {
            this.slim_video_metadata = results.firstOfType(ItemSection)?.contents?.firstOfType(SlimVideoMetadata);
            this.watch_next_feed = secondary_results.firstOfType(ItemSection)?.contents || secondary_results;
            this.current_video_endpoint = next?.current_video_endpoint;
            this.player_overlays = next?.player_overlays?.item().as(PlayerOverlay);
        }
    }
}
//# sourceMappingURL=VideoInfo.js.map