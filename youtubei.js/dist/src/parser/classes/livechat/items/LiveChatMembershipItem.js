import { YTNode } from '../../../helpers.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Author from '../../misc/Author.js';
import Text from '../../misc/Text.js';
class LiveChatMembershipItem extends YTNode {
    constructor(data) {
        super();
        this.id = data.id;
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1000);
        this.timestamp_usec = data.timestampUsec;
        if (Reflect.has(data, 'timestampText')) {
            this.timestamp_text = new Text(data.timestampText);
        }
        if (Reflect.has(data, 'headerPrimaryText')) {
            this.header_primary_text = new Text(data.headerPrimaryText);
        }
        this.header_subtext = new Text(data.headerSubtext);
        if (Reflect.has(data, 'message')) {
            this.message = new Text(data.message);
        }
        this.author = new Author(data.authorName, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
        this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
        this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
    }
}
LiveChatMembershipItem.type = 'LiveChatMembershipItem';
export default LiveChatMembershipItem;
//# sourceMappingURL=LiveChatMembershipItem.js.map