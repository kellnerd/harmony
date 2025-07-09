import { YTNode } from '../../../helpers.js';
import { Parser } from '../../../index.js';
import BumperUserEduContentView from './BumperUserEduContentView.js';
class LiveChatItemBumperView extends YTNode {
    constructor(data) {
        super();
        this.content = Parser.parseItem(data.content, BumperUserEduContentView);
    }
}
LiveChatItemBumperView.type = 'LiveChatItemBumperView';
export default LiveChatItemBumperView;
//# sourceMappingURL=LiveChatItemBumperView.js.map