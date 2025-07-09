var _WatchEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'player';
class WatchEndpoint extends YTNode {
    constructor(data) {
        super();
        _WatchEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _WatchEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _WatchEndpoint_data, "f").videoId)
            request.videoId = __classPrivateFieldGet(this, _WatchEndpoint_data, "f").videoId;
        if (__classPrivateFieldGet(this, _WatchEndpoint_data, "f").playlistId)
            request.playlistId = __classPrivateFieldGet(this, _WatchEndpoint_data, "f").playlistId;
        if (__classPrivateFieldGet(this, _WatchEndpoint_data, "f").index !== undefined || __classPrivateFieldGet(this, _WatchEndpoint_data, "f").playlistIndex !== undefined)
            request.playlistIndex = __classPrivateFieldGet(this, _WatchEndpoint_data, "f").index || __classPrivateFieldGet(this, _WatchEndpoint_data, "f").playlistIndex;
        if (__classPrivateFieldGet(this, _WatchEndpoint_data, "f").playerParams || __classPrivateFieldGet(this, _WatchEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _WatchEndpoint_data, "f").playerParams || __classPrivateFieldGet(this, _WatchEndpoint_data, "f").params;
        if (__classPrivateFieldGet(this, _WatchEndpoint_data, "f").startTimeSeconds)
            request.startTimeSecs = __classPrivateFieldGet(this, _WatchEndpoint_data, "f").startTimeSeconds;
        if (__classPrivateFieldGet(this, _WatchEndpoint_data, "f").overrideMutedAtStart)
            request.overrideMutedAtStart = __classPrivateFieldGet(this, _WatchEndpoint_data, "f").overrideMutedAtStart;
        request.racyCheckOk = !!__classPrivateFieldGet(this, _WatchEndpoint_data, "f").racyCheckOk;
        request.contentCheckOk = !!__classPrivateFieldGet(this, _WatchEndpoint_data, "f").contentCheckOk;
        return request;
    }
}
_WatchEndpoint_data = new WeakMap();
WatchEndpoint.type = 'WatchEndpoint';
export default WatchEndpoint;
//# sourceMappingURL=WatchEndpoint.js.map