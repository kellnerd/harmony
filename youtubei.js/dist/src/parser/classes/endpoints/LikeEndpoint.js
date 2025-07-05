var _LikeEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const LIKE_API_PATH = 'like/like';
const DISLIKE_API_PATH = 'like/dislike';
const REMOVE_LIKE_API_PATH = 'like/removelike';
class LikeEndpoint extends YTNode {
    constructor(data) {
        super();
        _LikeEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _LikeEndpoint_data, data, "f");
    }
    getApiPath() {
        return __classPrivateFieldGet(this, _LikeEndpoint_data, "f").status === 'DISLIKE' ?
            DISLIKE_API_PATH : __classPrivateFieldGet(this, _LikeEndpoint_data, "f").status === 'INDIFFERENT' ?
            REMOVE_LIKE_API_PATH : LIKE_API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _LikeEndpoint_data, "f").target)
            request.target = __classPrivateFieldGet(this, _LikeEndpoint_data, "f").target;
        const params = this.getParams();
        if (params)
            request.params = params;
        return request;
    }
    getParams() {
        switch (__classPrivateFieldGet(this, _LikeEndpoint_data, "f").status) {
            case 'LIKE':
                return __classPrivateFieldGet(this, _LikeEndpoint_data, "f").likeParams;
            case 'DISLIKE':
                return __classPrivateFieldGet(this, _LikeEndpoint_data, "f").dislikeParams;
            case 'INDIFFERENT':
                return __classPrivateFieldGet(this, _LikeEndpoint_data, "f").removeLikeParams;
            default:
                return undefined;
        }
    }
}
_LikeEndpoint_data = new WeakMap();
LikeEndpoint.type = 'LikeEndpoint';
export default LikeEndpoint;
//# sourceMappingURL=LikeEndpoint.js.map