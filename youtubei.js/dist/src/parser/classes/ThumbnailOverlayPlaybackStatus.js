import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class ThumbnailOverlayPlaybackStatus extends YTNode {
    constructor(data) {
        super();
        this.texts = data.texts.map((text) => new Text(text));
    }
}
ThumbnailOverlayPlaybackStatus.type = 'ThumbnailOverlayPlaybackStatus';
export default ThumbnailOverlayPlaybackStatus;
//# sourceMappingURL=ThumbnailOverlayPlaybackStatus.js.map