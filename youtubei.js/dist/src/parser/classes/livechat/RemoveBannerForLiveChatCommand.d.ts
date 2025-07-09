import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class RemoveBannerForLiveChatCommand extends YTNode {
    static type: string;
    target_action_id: string;
    constructor(data: RawNode);
}
