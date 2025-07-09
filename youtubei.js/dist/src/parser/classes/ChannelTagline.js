import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import EngagementPanelSectionList from './EngagementPanelSectionList.js';
class ChannelTagline extends YTNode {
    constructor(data) {
        super();
        this.content = data.content;
        this.max_lines = data.maxLines;
        this.more_endpoint = data.moreEndpoint.showEngagementPanelEndpoint ? {
            show_engagement_panel_endpoint: {
                engagement_panel: Parser.parseItem(data.moreEndpoint.showEngagementPanelEndpoint.engagementPanel, EngagementPanelSectionList),
                engagement_panel_popup_type: data.moreEndpoint.showEngagementPanelEndpoint.engagementPanelPresentationConfigs.engagementPanelPopupPresentationConfig.popupType,
                identifier: {
                    surface: data.moreEndpoint.showEngagementPanelEndpoint.identifier.surface,
                    tag: data.moreEndpoint.showEngagementPanelEndpoint.identifier.tag
                }
            }
        } : new NavigationEndpoint(data.moreEndpoint);
        this.more_icon_type = data.moreIcon.iconType;
        this.more_label = data.moreLabel;
        this.target_id = data.targetId;
    }
}
ChannelTagline.type = 'ChannelTagline';
export default ChannelTagline;
//# sourceMappingURL=ChannelTagline.js.map