var _ModifyChannelNotificationPreferenceEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'notification/modify_channel_preference';
class ModifyChannelNotificationPreferenceEndpoint extends YTNode {
    constructor(data) {
        super();
        _ModifyChannelNotificationPreferenceEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _ModifyChannelNotificationPreferenceEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _ModifyChannelNotificationPreferenceEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _ModifyChannelNotificationPreferenceEndpoint_data, "f").params;
        if (__classPrivateFieldGet(this, _ModifyChannelNotificationPreferenceEndpoint_data, "f").secondaryParams)
            request.secondaryParams = __classPrivateFieldGet(this, _ModifyChannelNotificationPreferenceEndpoint_data, "f").secondaryParams;
        return request;
    }
}
_ModifyChannelNotificationPreferenceEndpoint_data = new WeakMap();
ModifyChannelNotificationPreferenceEndpoint.type = 'ModifyChannelNotificationPreferenceEndpoint';
export default ModifyChannelNotificationPreferenceEndpoint;
//# sourceMappingURL=ModifyChannelNotificationPreferenceEndpoint.js.map