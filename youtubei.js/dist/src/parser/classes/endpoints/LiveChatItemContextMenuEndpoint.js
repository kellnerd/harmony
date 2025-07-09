var _LiveChatItemContextMenuEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'live_chat/get_item_context_menu';
class LiveChatItemContextMenuEndpoint extends YTNode {
    constructor(data) {
        super();
        _LiveChatItemContextMenuEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _LiveChatItemContextMenuEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _LiveChatItemContextMenuEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _LiveChatItemContextMenuEndpoint_data, "f").params;
        return request;
    }
}
_LiveChatItemContextMenuEndpoint_data = new WeakMap();
LiveChatItemContextMenuEndpoint.type = 'LiveChatItemContextMenuEndpoint';
export default LiveChatItemContextMenuEndpoint;
//# sourceMappingURL=LiveChatItemContextMenuEndpoint.js.map