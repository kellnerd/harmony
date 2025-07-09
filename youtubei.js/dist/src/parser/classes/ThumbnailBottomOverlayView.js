import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ThumbnailBadgeView from './ThumbnailBadgeView.js';
import ThumbnailOverlayProgressBarView from './ThumbnailOverlayProgressBarView.js';
class ThumbnailBottomOverlayView extends YTNode {
    constructor(data) {
        super();
        this.progress_bar = Parser.parseItem(data.progressBar, ThumbnailOverlayProgressBarView);
        this.badges = Parser.parseArray(data.badges, ThumbnailBadgeView);
    }
}
ThumbnailBottomOverlayView.type = 'ThumbnailBottomOverlayView';
export default ThumbnailBottomOverlayView;
//# sourceMappingURL=ThumbnailBottomOverlayView.js.map