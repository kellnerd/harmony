import { Text } from '../misc.js';
import { YTNode } from '../helpers.js';
class VideoViewCount extends YTNode {
    constructor(data) {
        super();
        this.original_view_count = data.originalViewCount;
        this.short_view_count = new Text(data.shortViewCount);
        this.extra_short_view_count = new Text(data.extraShortViewCount);
        this.view_count = new Text(data.viewCount);
    }
}
VideoViewCount.type = 'VideoViewCount';
export default VideoViewCount;
//# sourceMappingURL=VideoViewCount.js.map