import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
export default class LiveChatPlaceholderItem extends YTNode {
    static type: string;
    id: string;
    timestamp: number;
    constructor(data: RawNode);
}
