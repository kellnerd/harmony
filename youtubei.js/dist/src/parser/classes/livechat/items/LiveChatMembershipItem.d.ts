import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Author from '../../misc/Author.js';
import Text from '../../misc/Text.js';
export default class LiveChatMembershipItem extends YTNode {
    static type: string;
    id: string;
    timestamp: number;
    timestamp_usec: string;
    timestamp_text?: Text;
    header_primary_text?: Text;
    header_subtext: Text;
    message?: Text;
    author: Author;
    menu_endpoint: NavigationEndpoint;
    context_menu_accessibility_label: string;
    constructor(data: RawNode);
}
