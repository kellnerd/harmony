import LiveChatActionPanel from './LiveChatActionPanel.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export default class ShowLiveChatActionPanelAction extends YTNode {
    static type: string;
    panel_to_show: LiveChatActionPanel | null;
    constructor(data: RawNode);
}
