var _CreateCommentEndpoint_data;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { YTNode } from '../../helpers.js';
const API_PATH = 'comment/create_comment';
class CreateCommentEndpoint extends YTNode {
    constructor(data) {
        super();
        _CreateCommentEndpoint_data.set(this, void 0);
        __classPrivateFieldSet(this, _CreateCommentEndpoint_data, data, "f");
    }
    getApiPath() {
        return API_PATH;
    }
    buildRequest() {
        const request = {};
        if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").createCommentParams)
            request.createCommentParams = __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").createCommentParams;
        if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").commentText)
            request.commentText = __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").commentText;
        if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").attachedVideoId)
            request.videoAttachment = { videoId: __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").attachedVideoId };
        else if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").pollOptions)
            request.pollAttachment = { choices: __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").pollOptions };
        else if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").imageBlobId)
            request.imageAttachment = { encryptedBlobId: __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").imageBlobId };
        else if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").sharedPostId)
            request.sharedPostAttachment = { postId: __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").sharedPostId };
        if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").accessRestrictions && typeof __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").accessRestrictions === 'number') {
            const restriction = __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").accessRestrictions === 1 ? 'RESTRICTION_TYPE_EVERYONE' : 'RESTRICTION_TYPE_SPONSORS_ONLY';
            request.accessRestrictions = { restriction };
        }
        if (__classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").botguardResponse)
            request.botguardResponse = __classPrivateFieldGet(this, _CreateCommentEndpoint_data, "f").botguardResponse;
        return request;
    }
}
_CreateCommentEndpoint_data = new WeakMap();
CreateCommentEndpoint.type = 'CreateCommentEndpoint';
export default CreateCommentEndpoint;
//# sourceMappingURL=CreateCommentEndpoint.js.map