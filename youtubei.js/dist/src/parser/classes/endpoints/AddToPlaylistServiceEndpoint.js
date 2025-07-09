var _AddToPlaylistServiceEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'playlist/get_add_to_playlist';
class AddToPlaylistServiceEndpoint extends YTNode {
    constructor(data) {
        super();
        _AddToPlaylistServiceEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _AddToPlaylistServiceEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        request.videoIds = __classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").videoIds ? __classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").videoIds : [__classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").videoId];
        if (__classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").playlistId)
            request.playlistId = __classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").playlistId;
        if (__classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").params;
        request.excludeWatchLater = !!__classPrivateFieldGet(this, _AddToPlaylistServiceEndpoint_data, "f").excludeWatchLater;
        return request;
    }
}
_AddToPlaylistServiceEndpoint_data = new WeakMap();
AddToPlaylistServiceEndpoint.type = 'AddToPlaylistServiceEndpoint';
export default AddToPlaylistServiceEndpoint;
//# sourceMappingURL=AddToPlaylistServiceEndpoint.js.map