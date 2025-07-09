import { Parser } from '../index.js';
import { YTNode } from '../helpers.js';
class SharePanelHeader extends YTNode {
    constructor(data) {
        super();
        this.title = Parser.parseItem(data.title);
    }
}
SharePanelHeader.type = 'SharePanelHeader';
export default SharePanelHeader;
//# sourceMappingURL=SharePanelHeader.js.map