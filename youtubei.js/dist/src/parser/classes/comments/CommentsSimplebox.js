import { YTNode } from '../../helpers.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
class CommentsSimplebox extends YTNode {
    constructor(data) {
        super();
        this.simplebox_avatar = Thumbnail.fromResponse(data.simpleboxAvatar);
        this.simplebox_placeholder = new Text(data.simpleboxPlaceholder);
    }
}
CommentsSimplebox.type = 'CommentsSimplebox';
export default CommentsSimplebox;
//# sourceMappingURL=CommentsSimplebox.js.map