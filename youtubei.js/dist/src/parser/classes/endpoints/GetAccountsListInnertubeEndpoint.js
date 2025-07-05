var _GetAccountsListInnertubeEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'account/accounts_list';
class GetAccountsListInnertubeEndpoint extends YTNode {
    constructor(data) {
        super();
        _GetAccountsListInnertubeEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _GetAccountsListInnertubeEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").requestType) {
            request.requestType = __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").requestType;
            if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").requestType === 'ACCOUNTS_LIST_REQUEST_TYPE_CHANNEL_SWITCHER' || __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").requestType === 'ACCOUNTS_LIST_REQUEST_TYPE_IDENTITY_PROMPT') {
                if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").nextUrl)
                    request.nextNavendpoint = {
                        urlEndpoint: {
                            url: __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").nextUrl
                        }
                    };
            }
        }
        if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").channelSwitcherQuery)
            request.channelSwitcherQuery = __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").channelSwitcherQuery;
        if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").triggerChannelCreation)
            request.triggerChannelCreation = __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").triggerChannelCreation;
        if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").contentOwnerConfig && __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").contentOwnerConfig.externalContentOwnerId)
            request.contentOwnerConfig = __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").contentOwnerConfig;
        if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").obfuscatedSelectedGaiaId)
            request.obfuscatedSelectedGaiaId = __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").obfuscatedSelectedGaiaId;
        if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").selectedSerializedDelegationContext)
            request.selectedSerializedDelegationContext = __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").selectedSerializedDelegationContext;
        if (__classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").callCircumstance)
            request.callCircumstance = __classPrivateFieldGet(this, _GetAccountsListInnertubeEndpoint_data, "f").callCircumstance;
        return request;
    }
}
_GetAccountsListInnertubeEndpoint_data = new WeakMap();
GetAccountsListInnertubeEndpoint.type = 'GetAccountsListInnertubeEndpoint';
export default GetAccountsListInnertubeEndpoint;
//# sourceMappingURL=GetAccountsListInnertubeEndpoint.js.map