var _PerformCommentActionEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'comment/perform_comment_action';
class PerformCommentActionEndpoint extends YTNode {
    constructor(data) {
        super();
        _PerformCommentActionEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _PerformCommentActionEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _PerformCommentActionEndpoint_data, "f").actions)
            request.actions = __classPrivateFieldGet(this, _PerformCommentActionEndpoint_data, "f").actions;
        if (__classPrivateFieldGet(this, _PerformCommentActionEndpoint_data, "f").action)
            request.actions = [__classPrivateFieldGet(this, _PerformCommentActionEndpoint_data, "f").action];
        return request;
    }
}
_PerformCommentActionEndpoint_data = new WeakMap();
PerformCommentActionEndpoint.type = 'PerformCommentActionEndpoint';
export default PerformCommentActionEndpoint;
//# sourceMappingURL=PerformCommentActionEndpoint.js.map