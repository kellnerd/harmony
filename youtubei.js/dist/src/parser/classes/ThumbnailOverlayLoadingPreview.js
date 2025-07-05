import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class ThumbnailOverlayLoadingPreview extends YTNode {
    constructor(data) {
        super();
        this.text = new Text(data.text);
    }
}
ThumbnailOverlayLoadingPreview.type = 'ThumbnailOverlayLoadingPreview';
export default ThumbnailOverlayLoadingPreview;
//# sourceMappingURL=ThumbnailOverlayLoadingPreview.js.map