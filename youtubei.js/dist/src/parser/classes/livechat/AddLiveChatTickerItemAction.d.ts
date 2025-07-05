import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class AddLiveChatTickerItemAction extends YTNode {
    static type: string;
    item: YTNode;
    duration_sec: string;
    constructor(data: RawNode);
}
