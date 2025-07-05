import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class LiveChatMessageInput extends YTNode {
    constructor(data) {
        super();
        this.author_name = new Text(data.authorName);
        this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
        this.send_button = Parser.parseItem(data.sendButton, Button);
        this.target_id = data.targetId;
    }
}
LiveChatMessageInput.type = 'LiveChatMessageInput';
export default LiveChatMessageInput;
//# sourceMappingURL=LiveChatMessageInput.js.map