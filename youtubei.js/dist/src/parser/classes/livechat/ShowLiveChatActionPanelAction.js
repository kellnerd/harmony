import { Parser } from '../../index.js';
import LiveChatActionPanel from './LiveChatActionPanel.js';
import { YTNode } from '../../helpers.js';
class ShowLiveChatActionPanelAction extends YTNode {
    constructor(data) {
        super();
        this.panel_to_show = Parser.parseItem(data.panelToShow, LiveChatActionPanel);
    }
}
ShowLiveChatActionPanelAction.type = 'ShowLiveChatActionPanelAction';
export default ShowLiveChatActionPanelAction;
//# sourceMappingURL=ShowLiveChatActionPanelAction.js.map