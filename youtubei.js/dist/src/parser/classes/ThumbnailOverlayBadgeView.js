import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ThumbnailBadgeView from './ThumbnailBadgeView.js';
class ThumbnailOverlayBadgeView extends YTNode {
    constructor(data) {
        super();
        this.badges = Parser.parseArray(data.thumbnailBadges, ThumbnailBadgeView);
        this.position = data.position;
    }
}
ThumbnailOverlayBadgeView.type = 'ThumbnailOverlayBadgeView';
export default ThumbnailOverlayBadgeView;
//# sourceMappingURL=ThumbnailOverlayBadgeView.js.map