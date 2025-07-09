import type { RawNode } from '../../index.js';
import { YTNode } from '../../helpers.js';
export default class UpdateSubscribeButtonAction extends YTNode {
    static type: string;
    channel_id: string;
    subscribed: boolean;
    constructor(data: RawNode);
}
