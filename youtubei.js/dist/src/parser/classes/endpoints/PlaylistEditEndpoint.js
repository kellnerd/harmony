var _PlaylistEditEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'browse/edit_playlist';
class PlaylistEditEndpoint extends YTNode {
    constructor(data) {
        super();
        _PlaylistEditEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _PlaylistEditEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _PlaylistEditEndpoint_data, "f").actions)
            request.actions = __classPrivateFieldGet(this, _PlaylistEditEndpoint_data, "f").actions;
        if (__classPrivateFieldGet(this, _PlaylistEditEndpoint_data, "f").playlistId)
            request.playlistId = __classPrivateFieldGet(this, _PlaylistEditEndpoint_data, "f").playlistId;
        if (__classPrivateFieldGet(this, _PlaylistEditEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _PlaylistEditEndpoint_data, "f").params;
        return request;
    }
}
_PlaylistEditEndpoint_data = new WeakMap();
PlaylistEditEndpoint.type = 'PlaylistEditEndpoint';
export default PlaylistEditEndpoint;
//# sourceMappingURL=PlaylistEditEndpoint.js.map