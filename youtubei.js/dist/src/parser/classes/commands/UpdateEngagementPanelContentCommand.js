import { YTNode } from '../../helpers.js';
class UpdateEngagementPanelContentCommand extends YTNode {
    constructor(data) {
        super();
        this.content_source_panel_identifier = data.contentSourcePanelIdentifier;
        this.target_panel_identifier = data.targetPanelIdentifier;
    }
}
UpdateEngagementPanelContentCommand.type = 'UpdateEngagementPanelContentCommand';
export default UpdateEngagementPanelContentCommand;
//# sourceMappingURL=UpdateEngagementPanelContentCommand.js.map