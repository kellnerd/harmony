import { YTNode } from '../../helpers.js';
class HideEngagementPanelEndpoint extends YTNode {
    constructor(data) {
        super();
        this.panel_identifier = data.panelIdentifier;
    }
}
HideEngagementPanelEndpoint.type = 'HideEngagementPanelEndpoint';
export default HideEngagementPanelEndpoint;
//# sourceMappingURL=HideEngagementPanelEndpoint.js.map