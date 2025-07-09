var _DeletePlaylistEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'playlist/delete';
class DeletePlaylistEndpoint extends YTNode {
    constructor(data) {
        super();
        _DeletePlaylistEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _DeletePlaylistEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _DeletePlaylistEndpoint_data, "f").playlistId)
            request.playlistId = __classPrivateFieldGet(this, _DeletePlaylistEndpoint_data, "f").sourcePlaylistId;
        return request;
    }
}
_DeletePlaylistEndpoint_data = new WeakMap();
DeletePlaylistEndpoint.type = 'DeletePlaylistEndpoint';
export default DeletePlaylistEndpoint;
//# sourceMappingURL=DeletePlaylistEndpoint.js.map