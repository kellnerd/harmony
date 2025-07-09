import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
import Transcript from '../Transcript.js';
class UpdateEngagementPanelAction extends YTNode {
    constructor(data) {
        super();
        this.target_id = data.targetId;
        this.content = Parser.parseItem(data.content, Transcript);
    }
}
UpdateEngagementPanelAction.type = 'UpdateEngagementPanelAction';
export default UpdateEngagementPanelAction;
//# sourceMappingURL=UpdateEngagementPanelAction.js.map