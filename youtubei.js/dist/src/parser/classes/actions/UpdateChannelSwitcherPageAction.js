import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
import ChannelSwitcherPage from '../ChannelSwitcherPage.js';
class UpdateChannelSwitcherPageAction extends YTNode {
    constructor(data) {
        super();
        const page = Parser.parseItem(data.page, ChannelSwitcherPage);
        if (page) {
            this.header = page.header;
            this.contents = page.contents;
        }
    }
}
UpdateChannelSwitcherPageAction.type = 'UpdateChannelSwitcherPageAction';
export default UpdateChannelSwitcherPageAction;
//# sourceMappingURL=UpdateChannelSwitcherPageAction.js.map