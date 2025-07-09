var _ReelWatchEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'reel/reel_item_watch';
class ReelWatchEndpoint extends YTNode {
    constructor(data) {
        super();
        _ReelWatchEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _ReelWatchEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").videoId) {
            request.playerRequest = {
                videoId: __classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").videoId
            };
        }
        if (request.playerRequest) {
            if (__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").playerParams)
                request.playerRequest.params = __classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").playerParams;
            if (__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").racyCheckOk)
                request.playerRequest.racyCheckOk = !!__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").racyCheckOk;
            if (__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").contentCheckOk)
                request.playerRequest.contentCheckOk = !!__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").contentCheckOk;
        }
        if (__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").params;
        if (__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").inputType)
            request.inputType = __classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").inputType;
        request.disablePlayerResponse = !!__classPrivateFieldGet(this, _ReelWatchEndpoint_data, "f").disablePlayerResponse;
        return request;
    }
}
_ReelWatchEndpoint_data = new WeakMap();
ReelWatchEndpoint.type = 'ReelWatchEndpoint';
export default ReelWatchEndpoint;
//# sourceMappingURL=ReelWatchEndpoint.js.map