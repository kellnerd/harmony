import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Author from '../../misc/Author.js';
import Text from '../../misc/Text.js';
export default class LiveChatSponsorshipsGiftRedemptionAnnouncement extends YTNode {
    static type: string;
    id: string;
    timestamp_usec: string;
    timestamp_text: Text;
    author: Author;
    message: Text;
    menu_endpoint: NavigationEndpoint;
    context_menu_accessibility_label: string;
    constructor(data: RawNode);
}
