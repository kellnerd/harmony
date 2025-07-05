import { Parser } from '../../index.js';
import { YTNode } from '../../helpers.js';
class AddChatItemAction extends YTNode {
    constructor(data) {
        super();
        this.item = Parser.parseItem(data.item);
        if (Reflect.has(data, 'clientId')) {
            this.client_id = data.clientId;
        }
    }
}
AddChatItemAction.type = 'AddChatItemAction';
export default AddChatItemAction;
//# sourceMappingURL=AddChatItemAction.js.map