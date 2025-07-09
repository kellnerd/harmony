var _CommentThread_instances, _CommentThread_actions, _CommentThread_continuation, _CommentThread_getPatchedReplies;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../../index.js';
import Button from '../Button.js';
import ContinuationItem from '../ContinuationItem.js';
import CommentView from './CommentView.js';
import CommentReplies from './CommentReplies.js';
import { InnertubeError } from '../../../utils/Utils.js';
import { observe, YTNode } from '../../helpers.js';
class CommentThread extends YTNode {
    constructor(data) {
        super();
        _CommentThread_instances.add(this);
        _CommentThread_actions.set(this, void 0);
        _CommentThread_continuation.set(this, void 0);
        this.comment = Parser.parseItem(data.commentViewModel, CommentView);
        this.comment_replies_data = Parser.parseItem(data.replies, CommentReplies);
        this.is_moderated_elq_comment = data.isModeratedElqComment;
        this.has_replies = !!this.comment_replies_data;
    }
    get has_continuation() {
        if (!this.replies)
            throw new InnertubeError('Cannot determine if there is a continuation because this thread\'s replies have not been loaded.');
        return !!__classPrivateFieldGet(this, _CommentThread_continuation, "f");
    }
    /**
     * Retrieves replies to this comment thread.
     */
    async getReplies() {
        if (!__classPrivateFieldGet(this, _CommentThread_actions, "f"))
            throw new InnertubeError('Actions instance not set for this thread.');
        if (!this.comment_replies_data)
            throw new InnertubeError('This comment has no replies.', this);
        const continuation = this.comment_replies_data.contents?.firstOfType(ContinuationItem);
        if (!continuation)
            throw new InnertubeError('Replies continuation not found.');
        const response = await continuation.endpoint.call(__classPrivateFieldGet(this, _CommentThread_actions, "f"), { parse: true });
        if (!response.on_response_received_endpoints_memo)
            throw new InnertubeError('Unexpected response.', response);
        this.replies = __classPrivateFieldGet(this, _CommentThread_instances, "m", _CommentThread_getPatchedReplies).call(this, response.on_response_received_endpoints_memo);
        __classPrivateFieldSet(this, _CommentThread_continuation, response.on_response_received_endpoints_memo.getType(ContinuationItem)[0], "f");
        return this;
    }
    /**
     * Retrieves next batch of replies.
     */
    async getContinuation() {
        if (!this.replies)
            throw new InnertubeError('Cannot retrieve continuation because this thread\'s replies have not been loaded.');
        if (!__classPrivateFieldGet(this, _CommentThread_continuation, "f"))
            throw new InnertubeError('Continuation not found.');
        if (!__classPrivateFieldGet(this, _CommentThread_actions, "f"))
            throw new InnertubeError('Actions instance not set for this thread.');
        const load_more_button = __classPrivateFieldGet(this, _CommentThread_continuation, "f").button?.as(Button);
        if (!load_more_button)
            throw new InnertubeError('"Load more" button not found.');
        const response = await load_more_button.endpoint.call(__classPrivateFieldGet(this, _CommentThread_actions, "f"), { parse: true });
        if (!response.on_response_received_endpoints_memo)
            throw new InnertubeError('Unexpected response.', response);
        this.replies = __classPrivateFieldGet(this, _CommentThread_instances, "m", _CommentThread_getPatchedReplies).call(this, response.on_response_received_endpoints_memo);
        __classPrivateFieldSet(this, _CommentThread_continuation, response.on_response_received_endpoints_memo.getType(ContinuationItem)[0], "f");
        return this;
    }
    setActions(actions) {
        __classPrivateFieldSet(this, _CommentThread_actions, actions, "f");
    }
}
_CommentThread_actions = new WeakMap(), _CommentThread_continuation = new WeakMap(), _CommentThread_instances = new WeakSet(), _CommentThread_getPatchedReplies = function _CommentThread_getPatchedReplies(data) {
    return observe(data.getType(CommentView).map((comment) => {
        comment.setActions(__classPrivateFieldGet(this, _CommentThread_actions, "f"));
        return comment;
    }));
};
CommentThread.type = 'CommentThread';
export default CommentThread;
//# sourceMappingURL=CommentThread.js.map