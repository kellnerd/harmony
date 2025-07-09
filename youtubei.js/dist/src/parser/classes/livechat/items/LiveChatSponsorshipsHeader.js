import { Parser } from '../../../index.js';
import { YTNode } from '../../../helpers.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Text from '../../misc/Text.js';
import Thumbnail from '../../misc/Thumbnail.js';
import LiveChatAuthorBadge from '../../LiveChatAuthorBadge.js';
class LiveChatSponsorshipsHeader extends YTNode {
    constructor(data) {
        super();
        this.author_name = new Text(data.authorName);
        this.author_photo = Thumbnail.fromResponse(data.authorPhoto);
        this.author_badges = Parser.parseArray(data.authorBadges, LiveChatAuthorBadge);
        this.primary_text = new Text(data.primaryText);
        this.menu_endpoint = new NavigationEndpoint(data.contextMenuEndpoint);
        this.context_menu_accessibility_label = data.contextMenuAccessibility.accessibilityData.label;
        this.image = Thumbnail.fromResponse(data.image);
    }
}
LiveChatSponsorshipsHeader.type = 'LiveChatSponsorshipsHeader';
export default LiveChatSponsorshipsHeader;
//# sourceMappingURL=LiveChatSponsorshipsHeader.js.map