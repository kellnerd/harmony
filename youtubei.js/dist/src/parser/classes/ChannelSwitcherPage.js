import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
class ChannelSwitcherPage extends YTNode {
    constructor(data) {
        super();
        this.header = Parser.parseItem(data.header);
        this.contents = Parser.parse(data.contents, true);
    }
}
ChannelSwitcherPage.type = 'ChannelSwitcherPage';
export default ChannelSwitcherPage;
//# sourceMappingURL=ChannelSwitcherPage.js.map