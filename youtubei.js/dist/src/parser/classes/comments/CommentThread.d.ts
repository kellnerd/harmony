import CommentView from './CommentView.js';
import CommentReplies from './CommentReplies.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import type Actions from '../../../core/Actions.js';
import type { ObservedArray } from '../../helpers.js';
export default class CommentThread extends YTNode {
    #private;
    static type: string;
    comment: CommentView | null;
    replies?: ObservedArray<CommentView>;
    comment_replies_data: CommentReplies | null;
    is_moderated_elq_comment: boolean;
    has_replies: boolean;
    constructor(data: RawNode);
    get has_continuation(): boolean;
    /**
     * Retrieves replies to this comment thread.
     */
    getReplies(): Promise<CommentThread>;
    /**
     * Retrieves next batch of replies.
     */
    getContinuation(): Promise<CommentThread>;
    setActions(actions: Actions): void;
}
