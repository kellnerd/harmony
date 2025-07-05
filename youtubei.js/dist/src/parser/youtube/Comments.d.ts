import type { ObservedArray } from '../helpers.js';
import CommentsHeader from '../classes/comments/CommentsHeader.js';
import CommentThread from '../classes/comments/CommentThread.js';
import type { Actions, ApiResponse } from '../../core/index.js';
import type { INextResponse } from '../types/index.js';
export default class Comments {
    #private;
    header?: CommentsHeader;
    contents: ObservedArray<CommentThread>;
    constructor(actions: Actions, data: any, already_parsed?: boolean);
    /**
     * Applies given sort option to the comments.
     * @param sort - Sort type.
     */
    applySort(sort: 'TOP_COMMENTS' | 'NEWEST_FIRST'): Promise<Comments>;
    /**
     * Creates a top-level comment.
     * @param text - Comment text.
     */
    createComment(text: string): Promise<ApiResponse>;
    /**
     * Retrieves next batch of comments.
     */
    getContinuation(): Promise<Comments>;
    get has_continuation(): boolean;
    get page(): INextResponse;
}
