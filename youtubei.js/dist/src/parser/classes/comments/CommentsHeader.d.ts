import SortFilterSubMenu from '../SortFilterSubMenu.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode } from '../../helpers.js';
import type { RawNode } from '../../index.js';
export type CustomEmoji = {
    emoji_id: string;
    shortcuts: string[];
    search_terms: string[];
    image: Thumbnail[];
    is_custom_emoji: boolean;
};
export default class CommentsHeader extends YTNode {
    static type: string;
    title: Text;
    count: Text;
    comments_count: Text;
    create_renderer: YTNode;
    sort_menu: SortFilterSubMenu | null;
    custom_emojis?: CustomEmoji[];
    constructor(data: RawNode);
}
