import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class SharePanelTitleV15 extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
    }
}
SharePanelTitleV15.type = 'SharePanelTitleV15';
export default SharePanelTitleV15;
//# sourceMappingURL=SharePanelTitleV15.js.map