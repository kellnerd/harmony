import { YTNode } from '../../helpers.js';
class ShowEngagementPanelEndpoint extends YTNode {
    constructor(data) {
        super();
        this.panel_identifier = data.panelIdentifier;
        this.source_panel_identifier = data.sourcePanelIdentifier;
    }
}
ShowEngagementPanelEndpoint.type = 'ShowEngagementPanelEndpoint';
export default ShowEngagementPanelEndpoint;
//# sourceMappingURL=ShowEngagementPanelEndpoint.js.map