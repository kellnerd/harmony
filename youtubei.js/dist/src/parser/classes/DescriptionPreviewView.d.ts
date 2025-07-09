import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import EngagementPanelSectionList from './EngagementPanelSectionList.js';
import Text from './misc/Text.js';
import RendererContext from './misc/RendererContext.js';
export default class DescriptionPreviewView extends YTNode {
    static type: string;
    description?: Text;
    max_lines?: number;
    truncation_text?: Text;
    always_show_truncation_text: boolean;
    more_endpoint?: {
        show_engagement_panel_endpoint: {
            engagement_panel: EngagementPanelSectionList | null;
            engagement_panel_popup_type: string;
            identifier: {
                surface: string;
                tag: string;
            };
        };
    };
    renderer_context: RendererContext;
    constructor(data: RawNode);
}
