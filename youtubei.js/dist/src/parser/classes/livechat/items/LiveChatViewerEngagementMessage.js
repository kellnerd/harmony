import { Parser } from '../../../index.js';
import { YTNode } from '../../../helpers.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Text from '../../misc/Text.js';
class LiveChatViewerEngagementMessage extends YTNode {
    constructor(data) {
        super();
        this.id = data.id;
        if (Reflect.has(data, 'timestampUsec')) {
            this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1000);
            this.timestamp_usec = data.timestampUsec;
        }
        if (Reflect.has(data, 'icon') && Reflect.has(data.icon, 'iconType')) {
            this.icon_type = data.icon.iconType;
        }
        this.message = new Text(data.message);
        this.action_button = Parser.parseItem(data.actionButton);
        if (Reflect.has(data, 'contextMenuEndpoint')) {
            this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
        }
        if (Reflect.has(data, 'contextMenuAccessibility') &&
            Reflect.has(data.contextMenuAccessibility, 'accessibilityData') &&
            Reflect.has(data.contextMenuAccessibility.accessibilityData, 'label')) {
            this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
        }
    }
}
LiveChatViewerEngagementMessage.type = 'LiveChatViewerEngagementMessage';
export default LiveChatViewerEngagementMessage;
//# sourceMappingURL=LiveChatViewerEngagementMessage.js.map