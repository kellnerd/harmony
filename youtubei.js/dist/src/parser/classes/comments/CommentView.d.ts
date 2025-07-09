import { YTNode } from '../../helpers.js';
import NavigationEndpoint from '../NavigationEndpoint.js';
import Author from '../misc/Author.js';
import Text from '../misc/Text.js';
import type Actions from '../../../core/Actions.js';
import type { ApiResponse } from '../../../core/Actions.js';
import type { RawNode } from '../../index.js';
export type CommentKeys = {
    comment: string;
    comment_surface: string;
    toolbar_state: string;
    toolbar_surface: string;
    shared: string;
};
export type MemberBadge = {
    url: string;
    a11y: string;
};
export default class CommentView extends YTNode {
    #private;
    static type: string;
    like_command?: NavigationEndpoint;
    dislike_command?: NavigationEndpoint;
    unlike_command?: NavigationEndpoint;
    undislike_command?: NavigationEndpoint;
    reply_command?: NavigationEndpoint;
    prepare_account_command?: NavigationEndpoint;
    comment_id: string;
    is_pinned: boolean;
    keys: CommentKeys;
    content?: Text;
    published_time?: string;
    author_is_channel_owner?: boolean;
    creator_thumbnail_url?: string;
    like_button_a11y?: string;
    like_count?: string;
    like_count_liked?: string;
    like_count_a11y?: string;
    like_active_tooltip?: string;
    like_inactive_tooltip?: string;
    dislike_active_tooltip?: string;
    dislike_inactive_tooltip?: string;
    heart_active_tooltip?: string;
    reply_count?: string;
    reply_count_a11y?: string;
    is_member?: boolean;
    member_badge?: MemberBadge;
    author?: Author;
    is_liked?: boolean;
    is_disliked?: boolean;
    is_hearted?: boolean;
    constructor(data: RawNode);
    applyMutations(comment?: RawNode, toolbar_state?: RawNode, toolbar_surface?: RawNode): void;
    /**
     * Likes the comment.
     * @returns A promise that resolves to the API response.
     * @throws If the Actions instance is not set for this comment or if the like command is not found.
     */
    like(): Promise<ApiResponse>;
    /**
     * Dislikes the comment.
     * @returns A promise that resolves to the API response.
     * @throws If the Actions instance is not set for this comment or if the dislike command is not found.
     */
    dislike(): Promise<ApiResponse>;
    /**
     * Unlikes the comment.
     * @returns A promise that resolves to the API response.
     * @throws If the Actions instance is not set for this comment or if the unlike command is not found.
     */
    unlike(): Promise<ApiResponse>;
    /**
     * Undislikes the comment.
     * @returns A promise that resolves to the API response.
     * @throws If the Actions instance is not set for this comment or if the undislike command is not found.
     */
    undislike(): Promise<ApiResponse>;
    /**
     * Replies to the comment.
     * @param comment_text - The text of the reply.
     * @returns A promise that resolves to the API response.
     * @throws If the Actions instance is not set for this comment or if the reply command is not found.
     */
    reply(comment_text: string): Promise<ApiResponse>;
    /**
     * Translates the comment to the specified target language.
     * @param target_language - The target language to translate the comment to, e.g. 'en', 'ja'.
     * @returns Resolves to an ApiResponse object with the translated content, if available.
     * @throws if the Actions instance is not set for this comment or if the comment content is not found.
     */
    translate(target_language: string): Promise<ApiResponse & {
        content?: string;
    }>;
    setActions(actions: Actions | undefined): void;
}
