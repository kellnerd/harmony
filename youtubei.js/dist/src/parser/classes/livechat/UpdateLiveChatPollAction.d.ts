import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class UpdateLiveChatPollAction extends YTNode {
    static type: string;
    poll_to_update: YTNode;
    constructor(data: RawNode);
}
