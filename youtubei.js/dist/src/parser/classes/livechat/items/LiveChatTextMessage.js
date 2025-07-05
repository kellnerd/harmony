import { YTNode } from '../../../helpers.js';
import { Parser } from '../../../index.js';
import Button from '../../Button.js';
import ButtonView from '../../ButtonView.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Author from '../../misc/Author.js';
import Text from '../../misc/Text.js';
class LiveChatTextMessage extends YTNode {
    constructor(data) {
        super();
        this.id = data.id;
        this.message = new Text(data.message);
        this.inline_action_buttons = Parser.parseArray(data.inlineActionButtons, Button);
        this.timestamp = Math.floor(parseInt(data.timestampUsec) / 1000);
        this.timestamp_usec = data.timestampUsec;
        if (Reflect.has(data, 'timestampText')) {
            this.timestamp_text = new Text(data.timestampText).toString();
        }
        this.author = new Author(data.authorName, data.authorBadges, data.authorPhoto, data.authorExternalChannelId);
        if (Reflect.has(data, 'contextMenuEndpoint')) {
            this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
        }
        if (Reflect.has(data, 'contextMenuAccessibility') &&
            Reflect.has(data.contextMenuAccessibility, 'accessibilityData') &&
            Reflect.has(data.contextMenuAccessibility.accessibilityData, 'label')) {
            this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
        }
        this.before_content_buttons = Parser.parseArray(data.beforeContentButtons, ButtonView);
    }
}
LiveChatTextMessage.type = 'LiveChatTextMessage';
export default LiveChatTextMessage;
//# sourceMappingURL=LiveChatTextMessage.js.map