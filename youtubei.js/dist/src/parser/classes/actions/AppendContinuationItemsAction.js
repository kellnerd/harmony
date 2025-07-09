import { Parser } from '../../index.js';
import { YTNode } from '../../helpers.js';
class AppendContinuationItemsAction extends YTNode {
    constructor(data) {
        super();
        this.contents = Parser.parseArray(data.continuationItems);
        this.target = data.target;
    }
}
AppendContinuationItemsAction.type = 'AppendContinuationItemsAction';
export default AppendContinuationItemsAction;
//# sourceMappingURL=AppendContinuationItemsAction.js.map