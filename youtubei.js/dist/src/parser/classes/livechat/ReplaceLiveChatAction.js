import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class ReplaceLiveChatAction extends YTNode {
    constructor(data) {
        super();
        this.to_replace = data.toReplace;
        this.replacement = Parser.parseItem(data.replacement);
    }
}
ReplaceLiveChatAction.type = 'ReplaceLiveChatAction';
export default ReplaceLiveChatAction;
//# sourceMappingURL=ReplaceLiveChatAction.js.map