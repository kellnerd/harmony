import { YTNode } from '../../../helpers.js';
import { Parser } from '../../../index.js';
import LiveChatSponsorshipsHeader from './LiveChatSponsorshipsHeader.js';
class LiveChatSponsorshipsGiftPurchaseAnnouncement extends YTNode {
    constructor(data) {
        super();
        this.id = data.id;
        this.timestamp_usec = data.timestampUsec;
        this.author_external_channel_id = data.authorExternalChannelId;
        this.header = Parser.parseItem(data.header, LiveChatSponsorshipsHeader);
    }
}
LiveChatSponsorshipsGiftPurchaseAnnouncement.type = 'LiveChatSponsorshipsGiftPurchaseAnnouncement';
export default LiveChatSponsorshipsGiftPurchaseAnnouncement;
//# sourceMappingURL=LiveChatSponsorshipsGiftPurchaseAnnouncement.js.map