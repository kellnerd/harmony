import Button from '../Button.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode, type ObservedArray } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class CommentReplies extends YTNode {
    static type: string;
    contents: ObservedArray<YTNode>;
    view_replies: Button | null;
    hide_replies: Button | null;
    view_replies_creator_thumbnail: Thumbnail[];
    has_channel_owner_replied: boolean;
    constructor(data: RawNode);
}
