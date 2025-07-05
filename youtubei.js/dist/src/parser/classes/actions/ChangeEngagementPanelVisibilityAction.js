import { YTNode } from '../../helpers.js';
class ChangeEngagementPanelVisibilityAction extends YTNode {
    constructor(data) {
        super();
        this.target_id = data.targetId;
        this.visibility = data.visibility;
    }
}
ChangeEngagementPanelVisibilityAction.type = 'ChangeEngagementPanelVisibilityAction';
export default ChangeEngagementPanelVisibilityAction;
//# sourceMappingURL=ChangeEngagementPanelVisibilityAction.js.map