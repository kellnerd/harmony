var _AccountManager_actions;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import AccountInfo from '../../parser/youtube/AccountInfo.js';
import Settings from '../../parser/youtube/Settings.js';
import NavigationEndpoint from '../../parser/classes/NavigationEndpoint.js';
import { InnertubeError } from '../../utils/Utils.js';
import { AccountItem } from '../../parser/nodes.js';
class AccountManager {
    constructor(actions) {
        _AccountManager_actions.set(this, void 0);
        __classPrivateFieldSet(this, _AccountManager_actions, actions, "f");
    }
    async getInfo(all = false) {
        if (!__classPrivateFieldGet(this, _AccountManager_actions, "f").session.logged_in)
            throw new InnertubeError('You must be signed in to perform this operation.');
        if (!all && !!__classPrivateFieldGet(this, _AccountManager_actions, "f").session.context.user.onBehalfOfUser) {
            throw new InnertubeError('Boolean argument must be true when "on_behalf_of_user" is specified.');
        }
        if (all) {
            const get_accounts_list_endpoint = new NavigationEndpoint({ getAccountsListInnertubeEndpoint: {
                    requestType: 'ACCOUNTS_LIST_REQUEST_TYPE_CHANNEL_SWITCHER',
                    callCircumstance: 'SWITCHING_USERS_FULL'
                } });
            const response = await get_accounts_list_endpoint.call(__classPrivateFieldGet(this, _AccountManager_actions, "f"), { client: 'WEB', parse: true });
            return response.actions_memo?.getType(AccountItem) || [];
        }
        const get_accounts_list_endpoint = new NavigationEndpoint({ getAccountsListInnertubeEndpoint: {} });
        const response = await get_accounts_list_endpoint.call(__classPrivateFieldGet(this, _AccountManager_actions, "f"), { client: 'TV' });
        return new AccountInfo(response);
    }
    /**
     * Gets YouTube settings.
     */
    async getSettings() {
        const browse_endpoint = new NavigationEndpoint({ browseEndpoint: { browseId: 'SPaccount_overview' } });
        const response = await browse_endpoint.call(__classPrivateFieldGet(this, _AccountManager_actions, "f"));
        return new Settings(__classPrivateFieldGet(this, _AccountManager_actions, "f"), response);
    }
}
_AccountManager_actions = new WeakMap();
export default AccountManager;
//# sourceMappingURL=AccountManager.js.map