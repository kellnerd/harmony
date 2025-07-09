import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ShowLiveChatDialogAction extends YTNode {
    static type: string;
    dialog: YTNode;
    constructor(data: RawNode);
}
