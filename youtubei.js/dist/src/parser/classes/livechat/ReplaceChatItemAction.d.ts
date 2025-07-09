import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ReplaceChatItemAction extends YTNode {
    static type: string;
    target_item_id: string;
    replacement_item: YTNode;
    constructor(data: RawNode);
}
