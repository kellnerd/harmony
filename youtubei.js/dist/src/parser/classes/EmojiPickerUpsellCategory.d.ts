import Text from './misc/Text.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import { YTNode } from '../helpers.js';
import type { RawNode } from '../index.js';
export default class EmojiPickerUpsellCategory extends YTNode {
    static type: string;
    category_id: string;
    title: Text;
    upsell: Text;
    emoji_tooltip: string;
    endpoint: NavigationEndpoint;
    emoji_ids: string[];
    constructor(data: RawNode);
}
