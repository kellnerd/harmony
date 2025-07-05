import { YTNode } from '../../../helpers.js';
import { type RawNode } from '../../../index.js';
import LiveChatSponsorshipsHeader from './LiveChatSponsorshipsHeader.js';
export default class LiveChatSponsorshipsGiftPurchaseAnnouncement extends YTNode {
    static type: string;
    id: string;
    timestamp_usec: string;
    author_external_channel_id: string;
    header: LiveChatSponsorshipsHeader | null;
    constructor(data: RawNode);
}
