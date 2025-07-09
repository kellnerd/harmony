import { YTNode } from '../helpers.js';
import Thumbnail from './misc/Thumbnail.js';
class ContentPreviewImageView extends YTNode {
    constructor(data) {
        super();
        this.image = Thumbnail.fromResponse(data.image);
        this.style = data.style;
    }
}
ContentPreviewImageView.type = 'ContentPreviewImageView';
export default ContentPreviewImageView;
//# sourceMappingURL=ContentPreviewImageView.js.map