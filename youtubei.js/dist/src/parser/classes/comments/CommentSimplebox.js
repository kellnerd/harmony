import { Parser } from '../../index.js';
import Button from '../Button.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode } from '../../helpers.js';
class CommentSimplebox extends YTNode {
    constructor(data) {
        super();
        this.submit_button = Parser.parseItem(data.submitButton, Button);
        this.cancel_button = Parser.parseItem(data.cancelButton, Button);
        this.author_thumbnail = Thumbnail.fromResponse(data.authorThumbnail);
        this.placeholder = new Text(data.placeholderText);
        this.avatar_size = data.avatarSize;
    }
}
CommentSimplebox.type = 'CommentSimplebox';
export default CommentSimplebox;
//# sourceMappingURL=CommentSimplebox.js.map