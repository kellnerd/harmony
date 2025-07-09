var _UnsubscribeEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'subscription/unsubscribe';
class UnsubscribeEndpoint extends YTNode {
    constructor(data) {
        super();
        _UnsubscribeEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _UnsubscribeEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _UnsubscribeEndpoint_data, "f").channelIds)
            request.channelIds = __classPrivateFieldGet(this, _UnsubscribeEndpoint_data, "f").channelIds;
        if (__classPrivateFieldGet(this, _UnsubscribeEndpoint_data, "f").siloName)
            request.siloName = __classPrivateFieldGet(this, _UnsubscribeEndpoint_data, "f").siloName;
        if (__classPrivateFieldGet(this, _UnsubscribeEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _UnsubscribeEndpoint_data, "f").params;
        return request;
    }
}
_UnsubscribeEndpoint_data = new WeakMap();
UnsubscribeEndpoint.type = 'UnsubscribeEndpoint';
export default UnsubscribeEndpoint;
//# sourceMappingURL=UnsubscribeEndpoint.js.map