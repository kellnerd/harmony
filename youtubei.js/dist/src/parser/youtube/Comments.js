var _Comments_page, _Comments_actions, _Comments_continuation;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Parser } from '../index.js';
import { InnertubeError } from '../../utils/Utils.js';
import { observe } from '../helpers.js';
import CommentsHeader from '../classes/comments/CommentsHeader.js';
import CommentSimplebox from '../classes/comments/CommentSimplebox.js';
import CommentThread from '../classes/comments/CommentThread.js';
import ContinuationItem from '../classes/ContinuationItem.js';
import { ReloadContinuationItemsCommand } from '../index.js';
import AppendContinuationItemsAction from '../classes/actions/AppendContinuationItemsAction.js';
class Comments {
    constructor(actions, data, already_parsed = false) {
        _Comments_page.set(this, void 0);
        _Comments_actions.set(this, void 0);
        _Comments_continuation.set(this, void 0);
        __classPrivateFieldSet(this, _Comments_page, already_parsed ? data : Parser.parseResponse(data), "f");
        __classPrivateFieldSet(this, _Comments_actions, actions, "f");
        const contents = __classPrivateFieldGet(this, _Comments_page, "f").on_response_received_endpoints;
        if (!contents)
            throw new InnertubeError('Comments page did not have any content.');
        const header_node = contents.at(0)?.as(AppendContinuationItemsAction, ReloadContinuationItemsCommand);
        const body_node = contents.at(1)?.as(AppendContinuationItemsAction, ReloadContinuationItemsCommand);
        this.header = header_node?.contents?.firstOfType(CommentsHeader);
        const threads = body_node?.contents?.filterType(CommentThread) || [];
        this.contents = observe(threads.map((thread) => {
            if (thread.comment)
                thread.comment.setActions(__classPrivateFieldGet(this, _Comments_actions, "f"));
            thread.setActions(__classPrivateFieldGet(this, _Comments_actions, "f"));
            return thread;
        }));
        __classPrivateFieldSet(this, _Comments_continuation, body_node?.contents?.firstOfType(ContinuationItem), "f");
    }
    /**
     * Applies given sort option to the comments.
     * @param sort - Sort type.
     */
    async applySort(sort) {
        if (!this.header)
            throw new InnertubeError('Page header is missing. Cannot apply sort option.');
        let button;
        if (sort === 'TOP_COMMENTS') {
            button = this.header.sort_menu?.sub_menu_items?.at(0);
        }
        else if (sort === 'NEWEST_FIRST') {
            button = this.header.sort_menu?.sub_menu_items?.at(1);
        }
        if (!button)
            throw new InnertubeError('Could not find target button.');
        if (button.selected)
            return this;
        const response = await button.endpoint.call(__classPrivateFieldGet(this, _Comments_actions, "f"), { parse: true });
        return new Comments(__classPrivateFieldGet(this, _Comments_actions, "f"), response, true);
    }
    /**
     * Creates a top-level comment.
     * @param text - Comment text.
     */
    async createComment(text) {
        if (!this.header)
            throw new InnertubeError('Page header is missing. Cannot create comment.');
        const button = this.header.create_renderer?.as(CommentSimplebox).submit_button;
        if (!button)
            throw new InnertubeError('Could not find target button. You are probably not logged in.');
        if (!button.endpoint)
            throw new InnertubeError('Button does not have an endpoint.');
        return await button.endpoint.call(__classPrivateFieldGet(this, _Comments_actions, "f"), { commentText: text });
    }
    /**
     * Retrieves next batch of comments.
     */
    async getContinuation() {
        if (!__classPrivateFieldGet(this, _Comments_continuation, "f"))
            throw new InnertubeError('Continuation not found');
        const data = await __classPrivateFieldGet(this, _Comments_continuation, "f").endpoint.call(__classPrivateFieldGet(this, _Comments_actions, "f"), { parse: true });
        // Copy the previous page so we can keep the header.
        const page = Object.assign({}, __classPrivateFieldGet(this, _Comments_page, "f"));
        if (!page.on_response_received_endpoints || !data.on_response_received_endpoints)
            throw new InnertubeError('Invalid reponse format, missing on_response_received_endpoints.');
        // Remove previous items and append the continuation.
        page.on_response_received_endpoints.pop();
        page.on_response_received_endpoints.push(data.on_response_received_endpoints[0]);
        return new Comments(__classPrivateFieldGet(this, _Comments_actions, "f"), page, true);
    }
    get has_continuation() {
        return !!__classPrivateFieldGet(this, _Comments_continuation, "f");
    }
    get page() {
        return __classPrivateFieldGet(this, _Comments_page, "f");
    }
}
_Comments_page = new WeakMap(), _Comments_actions = new WeakMap(), _Comments_continuation = new WeakMap();
export default Comments;
//# sourceMappingURL=Comments.js.map