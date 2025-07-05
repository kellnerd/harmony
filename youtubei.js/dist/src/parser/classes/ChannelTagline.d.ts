import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import EngagementPanelSectionList from './EngagementPanelSectionList.js';
export default class ChannelTagline extends YTNode {
    static type: string;
    content: string;
    max_lines: number;
    more_endpoint: {
        show_engagement_panel_endpoint: {
            engagement_panel: EngagementPanelSectionList | null;
            engagement_panel_popup_type: string;
            identifier: {
                surface: string;
                tag: string;
            };
        };
    } | NavigationEndpoint;
    more_icon_type: string;
    more_label: string;
    target_id: string;
    constructor(data: RawNode);
}
