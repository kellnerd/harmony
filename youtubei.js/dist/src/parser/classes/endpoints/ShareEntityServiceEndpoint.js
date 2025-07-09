var _ShareEntityServiceEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'share/get_share_panel';
class ShareEntityServiceEndpoint extends YTNode {
    constructor(data) {
        super();
        _ShareEntityServiceEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _ShareEntityServiceEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _ShareEntityServiceEndpoint_data, "f").serializedShareEntity)
            request.serializedSharedEntity = __classPrivateFieldGet(this, _ShareEntityServiceEndpoint_data, "f").serializedShareEntity;
        if (__classPrivateFieldGet(this, _ShareEntityServiceEndpoint_data, "f").clientParams)
            request.clientParams = __classPrivateFieldGet(this, _ShareEntityServiceEndpoint_data, "f").clientParams;
        return request;
    }
}
_ShareEntityServiceEndpoint_data = new WeakMap();
ShareEntityServiceEndpoint.type = 'ShareEntityServiceEndpoint';
export default ShareEntityServiceEndpoint;
//# sourceMappingURL=ShareEntityServiceEndpoint.js.map