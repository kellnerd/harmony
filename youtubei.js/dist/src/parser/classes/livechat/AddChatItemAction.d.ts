import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class AddChatItemAction extends YTNode {
    static type: string;
    item: YTNode;
    client_id?: string;
    constructor(data: RawNode);
}
