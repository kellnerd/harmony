var _CreatePlaylistServiceEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'playlist/create';
class CreatePlaylistServiceEndpoint extends YTNode {
    constructor(data) {
        super();
        _CreatePlaylistServiceEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _CreatePlaylistServiceEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").title)
            request.title = __classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").title;
        if (__classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").privacyStatus)
            request.privacyStatus = __classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").privacyStatus;
        if (__classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").description)
            request.description = __classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").description;
        if (__classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").videoIds)
            request.videoIds = __classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").videoIds;
        if (__classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").params;
        if (__classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").sourcePlaylistId)
            request.sourcePlaylistId = __classPrivateFieldGet(this, _CreatePlaylistServiceEndpoint_data, "f").sourcePlaylistId;
        return request;
    }
}
_CreatePlaylistServiceEndpoint_data = new WeakMap();
CreatePlaylistServiceEndpoint.type = 'CreatePlaylistServiceEndpoint';
export default CreatePlaylistServiceEndpoint;
//# sourceMappingURL=CreatePlaylistServiceEndpoint.js.map