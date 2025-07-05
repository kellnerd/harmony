import MetadataBadge from './MetadataBadge.js';
import Thumbnail from './misc/Thumbnail.js';
class LiveChatAuthorBadge extends MetadataBadge {
    constructor(data) {
        super(data);
        this.custom_thumbnail = Thumbnail.fromResponse(data.customThumbnail);
    }
}
LiveChatAuthorBadge.type = 'LiveChatAuthorBadge';
export default LiveChatAuthorBadge;
//# sourceMappingURL=LiveChatAuthorBadge.js.map