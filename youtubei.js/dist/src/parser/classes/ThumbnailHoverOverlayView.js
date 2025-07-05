import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class ThumbnailHoverOverlayView extends YTNode {
    constructor(data) {
        super();
        this.icon_name = data.icon.sources[0].clientResource.imageName;
        this.text = Text.fromAttributed(data.text);
        this.style = data.style;
    }
}
ThumbnailHoverOverlayView.type = 'ThumbnailHoverOverlayView';
export default ThumbnailHoverOverlayView;
//# sourceMappingURL=ThumbnailHoverOverlayView.js.map