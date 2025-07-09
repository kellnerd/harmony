import { YTNode } from '../../../helpers.js';
import type { RawNode } from '../../../index.js';
import NavigationEndpoint from '../../NavigationEndpoint.js';
import Author from '../../misc/Author.js';
import Thumbnail from '../../misc/Thumbnail.js';
export default class LiveChatPaidSticker extends YTNode {
    static type: string;
    id: string;
    author: Author;
    money_chip_background_color: number;
    money_chip_text_color: number;
    background_color: number;
    author_name_text_color: number;
    sticker: Thumbnail[];
    sticker_accessibility_label: string;
    sticker_display_width: number;
    sticker_display_height: number;
    purchase_amount: string;
    menu_endpoint: NavigationEndpoint;
    context_menu: NavigationEndpoint;
    context_menu_accessibility_label: string;
    timestamp: number;
    timestamp_usec: string;
    is_v2_style: boolean;
    constructor(data: RawNode);
}
