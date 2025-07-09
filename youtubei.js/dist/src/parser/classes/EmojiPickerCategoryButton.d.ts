import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class EmojiPickerCategoryButton extends YTNode {
    static type: string;
    category_id: string;
    icon_type?: string;
    tooltip: string;
    constructor(data: RawNode);
}
