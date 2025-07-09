import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import AnimatedThumbnailOverlayView from './AnimatedThumbnailOverlayView.js';
import ThumbnailHoverOverlayView from './ThumbnailHoverOverlayView.js';
import ThumbnailOverlayBadgeView from './ThumbnailOverlayBadgeView.js';
import Thumbnail from './misc/Thumbnail.js';
import ThumbnailHoverOverlayToggleActionsView from './ThumbnailHoverOverlayToggleActionsView.js';
import ThumbnailBottomOverlayView from './ThumbnailBottomOverlayView.js';
class ThumbnailView extends YTNode {
    constructor(data) {
        super();
        this.image = Thumbnail.fromResponse(data.image);
        this.overlays = Parser.parseArray(data.overlays, [
            ThumbnailHoverOverlayToggleActionsView, ThumbnailBottomOverlayView,
            ThumbnailOverlayBadgeView, ThumbnailHoverOverlayView,
            AnimatedThumbnailOverlayView
        ]);
        if ('backgroundColor' in data) {
            this.background_color = {
                light_theme: data.backgroundColor.lightTheme,
                dark_theme: data.backgroundColor.darkTheme
            };
        }
    }
}
ThumbnailView.type = 'ThumbnailView';
export default ThumbnailView;
//# sourceMappingURL=ThumbnailView.js.map