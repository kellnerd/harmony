import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ShowLiveChatTooltipCommand extends YTNode {
    static type: string;
    tooltip: YTNode;
    constructor(data: RawNode);
}
