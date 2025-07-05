import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import LiveChatParticipant from './LiveChatParticipant.js';
import Text from './misc/Text.js';
class LiveChatParticipantsList extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.participants = Parser.parseArray(data.participants, LiveChatParticipant);
    }
}
LiveChatParticipantsList.type = 'LiveChatParticipantsList';
export default LiveChatParticipantsList;
//# sourceMappingURL=LiveChatParticipantsList.js.map