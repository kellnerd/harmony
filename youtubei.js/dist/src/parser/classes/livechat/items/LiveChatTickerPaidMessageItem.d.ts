import Author from '../../misc/Author.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Text from '../../misc/Text.js';
import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
export default class LiveChatTickerPaidMessageItem extends YTNode {
    static type: string;
    id: string;
    author: Author;
    amount?: Text;
    amount_text_color: number;
    start_background_color: number;
    end_background_color: number;
    duration_sec: number;
    full_duration_sec: number;
    show_item: YTNode;
    show_item_endpoint: NavigationEndpoint;
    animation_origin: string;
    open_engagement_panel_command: NavigationEndpoint;
    constructor(data: RawNode);
}
