import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
class Message extends YTNode {
    constructor(data) {
        super();
        this.text = new Text(data.text);
    }
}
Message.type = 'Message';
export default Message;
//# sourceMappingURL=Message.js.map