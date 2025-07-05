import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
class ImageBannerView extends YTNode {
    constructor(data) {
        super();
        this.image = Thumbnail.fromResponse(data.image);
        this.style = data.style;
    }
}
ImageBannerView.type = 'ImageBannerView';
export default ImageBannerView;
//# sourceMappingURL=ImageBannerView.js.map