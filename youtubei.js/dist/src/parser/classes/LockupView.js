import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ThumbnailView from './ThumbnailView.js';
import CollectionThumbnailView from './CollectionThumbnailView.js';
import LockupMetadataView from './LockupMetadataView.js';
import RendererContext from './misc/RendererContext.js';
class LockupView extends YTNode {
    constructor(data) {
        super();
        this.content_image = Parser.parseItem(data.contentImage, [CollectionThumbnailView, ThumbnailView]);
        this.metadata = Parser.parseItem(data.metadata, LockupMetadataView);
        this.content_id = data.contentId;
        this.content_type = data.contentType.replace('LOCKUP_CONTENT_TYPE_', '');
        this.renderer_context = new RendererContext(data.rendererContext);
    }
}
LockupView.type = 'LockupView';
export default LockupView;
//# sourceMappingURL=LockupView.js.map