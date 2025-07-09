var _SubscribeEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'subscription/subscribe';
class SubscribeEndpoint extends YTNode {
    constructor(data) {
        super();
        _SubscribeEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _SubscribeEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").channelIds)
            request.channelIds = __classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").channelIds;
        if (__classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").siloName)
            request.siloName = __classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").siloName;
        if (__classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").params;
        if (__classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").botguardResponse)
            request.botguardResponse = __classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").botguardResponse;
        if (__classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").feature)
            request.clientFeature = __classPrivateFieldGet(this, _SubscribeEndpoint_data, "f").feature;
        return request;
    }
}
_SubscribeEndpoint_data = new WeakMap();
SubscribeEndpoint.type = 'SubscribeEndpoint';
export default SubscribeEndpoint;
//# sourceMappingURL=SubscribeEndpoint.js.map