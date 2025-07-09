import { YTNode } from '../../helpers.js';
import { type RawNode } from '../../index.js';
export default class ReplaceLiveChatAction extends YTNode {
    static type: string;
    to_replace: string;
    replacement: YTNode | null;
    constructor(data: RawNode);
}
