var _BrowseEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'browse';
class BrowseEndpoint extends YTNode {
    constructor(data) {
        super();
        _BrowseEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _BrowseEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").browseId)
            request.browseId = __classPrivateFieldGet(this, _BrowseEndpoint_data, "f").browseId;
        if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").params)
            request.params = __classPrivateFieldGet(this, _BrowseEndpoint_data, "f").params;
        if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").query)
            request.query = __classPrivateFieldGet(this, _BrowseEndpoint_data, "f").query;
        if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").browseId === 'FEsubscriptions') {
            request.subscriptionSettingsState = __classPrivateFieldGet(this, _BrowseEndpoint_data, "f").subscriptionSettingsState || 'MY_SUBS_SETTINGS_STATE_LAYOUT_FORMAT_LIST';
        }
        if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").browseId === 'SPaccount_playback') {
            request.formData = __classPrivateFieldGet(this, _BrowseEndpoint_data, "f").formData || {
                accountSettingsFormData: {
                    flagCaptionsDefaultOff: false,
                    flagAutoCaptionsDefaultOn: false,
                    flagDisableInlinePreview: false,
                    flagAudioDescriptionDefaultOn: false
                }
            };
        }
        if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").browseId === 'FEwhat_to_watch') {
            if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").browseRequestSupportedMetadata)
                request.browseRequestSupportedMetadata = __classPrivateFieldGet(this, _BrowseEndpoint_data, "f").browseRequestSupportedMetadata;
            if (__classPrivateFieldGet(this, _BrowseEndpoint_data, "f").inlineSettingStatus)
                request.inlineSettingStatus = __classPrivateFieldGet(this, _BrowseEndpoint_data, "f").inlineSettingStatus;
        }
        return request;
    }
}
_BrowseEndpoint_data = new WeakMap();
BrowseEndpoint.type = 'BrowseEndpoint';
export default BrowseEndpoint;
//# sourceMappingURL=BrowseEndpoint.js.map