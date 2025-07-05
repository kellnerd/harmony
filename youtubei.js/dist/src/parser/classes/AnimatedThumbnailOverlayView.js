import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
class AnimatedThumbnailOverlayView extends YTNode {
    constructor(data) {
        super();
        this.thumbnail = Thumbnail.fromResponse(data.thumbnail);
    }
}
AnimatedThumbnailOverlayView.type = 'AnimatedThumbnailOverlayView';
export default AnimatedThumbnailOverlayView;
//# sourceMappingURL=AnimatedThumbnailOverlayView.js.map