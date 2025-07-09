import { YTNode } from '../helpers.js';
import { type RawNode } from '../index.js';
import Button from './Button.js';
export default class LiveChatItemList extends YTNode {
    static type: string;
    max_items_to_display: string;
    more_comments_below_button: Button | null;
    constructor(data: RawNode);
}
