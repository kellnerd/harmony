import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Text from './misc/Text.js';
import Thumbnail from './misc/Thumbnail.js';
class LiveChatParticipant extends YTNode {
    constructor(data) {
        super();
        this.name = new Text(data.authorName);
        this.photo = Thumbnail.fromResponse(data.authorPhoto);
        this.badges = Parser.parseArray(data.authorBadges);
    }
}
LiveChatParticipant.type = 'LiveChatParticipant';
export default LiveChatParticipant;
//# sourceMappingURL=LiveChatParticipant.js.map