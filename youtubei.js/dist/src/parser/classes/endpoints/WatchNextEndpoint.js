var _WatchNextEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'next';
class WatchNextEndpoint extends YTNode {
    constructor(data) {
        super();
        _WatchNextEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _WatchNextEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").videoId)
            request.videoId = __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").videoId;
        if (__classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").playlistId)
            request.playlistId = __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").playlistId;
        if (__classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").index !== undefined || __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").playlistIndex !== undefined)
            request.playlistIndex = __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").index || __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").playlistIndex;
        if (__classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").playerParams || __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").playerParams || __classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").params;
        request.racyCheckOk = !!__classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").racyCheckOk;
        request.contentCheckOk = !!__classPrivateFieldGet(this, _WatchNextEndpoint_data, "f").contentCheckOk;
        return request;
    }
}
_WatchNextEndpoint_data = new WeakMap();
WatchNextEndpoint.type = 'WatchNextEndpoint';
export default WatchNextEndpoint;
//# sourceMappingURL=WatchNextEndpoint.js.map