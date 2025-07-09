import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
import LiveChatBanner from './items/LiveChatBanner.js';
export default class AddBannerToLiveChatCommand extends YTNode {
    static type: string;
    banner: LiveChatBanner | null;
    constructor(data: RawNode);
}
