var _FeedbackEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'feedback';
class FeedbackEndpoint extends YTNode {
    constructor(data) {
        super();
        _FeedbackEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _FeedbackEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _FeedbackEndpoint_data, "f").feedbackToken)
            request.feedbackTokens = [__classPrivateFieldGet(this, _FeedbackEndpoint_data, "f").feedbackToken];
        if (__classPrivateFieldGet(this, _FeedbackEndpoint_data, "f").cpn)
            request.feedbackContext = { cpn: __classPrivateFieldGet(this, _FeedbackEndpoint_data, "f").cpn };
        request.isFeedbackTokenUnencrypted = !!__classPrivateFieldGet(this, _FeedbackEndpoint_data, "f").isFeedbackTokenUnencrypted;
        request.shouldMerge = !!__classPrivateFieldGet(this, _FeedbackEndpoint_data, "f").shouldMerge;
        return request;
    }
}
_FeedbackEndpoint_data = new WeakMap();
FeedbackEndpoint.type = 'FeedbackEndpoint';
export default FeedbackEndpoint;
//# sourceMappingURL=FeedbackEndpoint.js.map