import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode } from '../../helpers.js';
class CommentsEntryPointTeaser extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'teaserAvatar')) {
            this.teaser_avatar = Thumbnail.fromResponse(data.teaserAvatar);
        }
        if (Reflect.has(data, 'teaserContent')) {
            this.teaser_content = new Text(data.teaserContent);
        }
    }
}
CommentsEntryPointTeaser.type = 'CommentsEntryPointTeaser';
export default CommentsEntryPointTeaser;
//# sourceMappingURL=CommentsEntryPointTeaser.js.map