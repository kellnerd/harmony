import { YTNode } from '../../../helpers.js';
import Author from '../../misc/Author.js';
import Text from '../../misc/Text.js';
class LiveChatTickerSponsorItem extends YTNode {
    constructor(data) {
        super();
        this.id = data.id;
        this.detail = new Text(data.detailText);
        this.author = new Author(data.authorName, data.authorBadges, data.sponsorPhoto, data.authorExternalChannelId);
        this.duration_sec = data.durationSec;
        // TODO: Parse remaining props.
    }
}
LiveChatTickerSponsorItem.type = 'LiveChatTickerSponsorItem';
export default LiveChatTickerSponsorItem;
//# sourceMappingURL=LiveChatTickerSponsorItem.js.map