import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class AuthorCommentBadge extends YTNode {
    #private;
    static type: string;
    icon_type?: string;
    tooltip: string;
    style?: string;
    constructor(data: RawNode);
    get orig_badge(): RawNode;
}
