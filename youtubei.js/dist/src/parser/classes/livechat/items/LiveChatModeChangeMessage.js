import { YTNode } from '../../../helpers.js';
import Text from '../../misc/Text.js';
class LiveChatModeChangeMessage extends YTNode {
    constructor(data) {
        super();
        this.id = data.id;
        this.icon_type = data.icon.iconType;
        this.text = new Text(data.text);
        this.subtext = new Text(data.subtext);
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1000);
        this.timestamp_usec = data.timestampUsec;
        this.timestamp_text = new Text(data.timestampText);
    }
}
LiveChatModeChangeMessage.type = 'LiveChatModeChangeMessage';
export default LiveChatModeChangeMessage;
//# sourceMappingURL=LiveChatModeChangeMessage.js.map