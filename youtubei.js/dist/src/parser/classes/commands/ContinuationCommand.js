var _ContinuationCommand_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
class ContinuationCommand extends YTNode {
    constructor(data) {
        super();
        _ContinuationCommand_data.set(this, void 0);
        __classPrivateFieldSet(this, _ContinuationCommand_data, data, "f");
    }
    getApiPath() {
        switch (__classPrivateFieldGet(this, _ContinuationCommand_data, "f").request) {
            case 'CONTINUATION_REQUEST_TYPE_WATCH_NEXT':
                return 'next';
            case 'CONTINUATION_REQUEST_TYPE_BROWSE':
                return 'browse';
            case 'CONTINUATION_REQUEST_TYPE_SEARCH':
                return 'search';
            case 'CONTINUATION_REQUEST_TYPE_ACCOUNTS_LIST':
                return 'account/accounts_list';
            case 'CONTINUATION_REQUEST_TYPE_COMMENTS_NOTIFICATION_MENU':
                return 'notification/get_notification_menu';
            case 'CONTINUATION_REQUEST_TYPE_COMMENT_REPLIES':
                return 'comment/get_comment_replies';
            case 'CONTINUATION_REQUEST_TYPE_REEL_WATCH_SEQUENCE':
                return 'reel/reel_watch_sequence';
            case 'CONTINUATION_REQUEST_TYPE_GET_PANEL':
                return 'get_panel';
            default:
                return '';
        }
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _ContinuationCommand_data, "f").formData)
            request.formData = __classPrivateFieldGet(this, _ContinuationCommand_data, "f").formData;
        if (__classPrivateFieldGet(this, _ContinuationCommand_data, "f").token)
            request.continuation = __classPrivateFieldGet(this, _ContinuationCommand_data, "f").token;
        if (__classPrivateFieldGet(this, _ContinuationCommand_data, "f").request === 'CONTINUATION_REQUEST_TYPE_COMMENTS_NOTIFICATION_MENU') {
            request.notificationsMenuRequestType = 'NOTIFICATIONS_MENU_REQUEST_TYPE_COMMENTS';
            if (__classPrivateFieldGet(this, _ContinuationCommand_data, "f").token) {
                request.fetchCommentsParams = {
                    continuation: __classPrivateFieldGet(this, _ContinuationCommand_data, "f").token
                };
                delete request.continuation;
            }
        }
        return request;
    }
}
_ContinuationCommand_data = new WeakMap();
ContinuationCommand.type = 'ContinuationCommand';
export default ContinuationCommand;
//# sourceMappingURL=ContinuationCommand.js.map