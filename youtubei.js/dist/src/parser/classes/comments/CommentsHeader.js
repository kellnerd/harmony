import { Parser } from '../../index.js';
import SortFilterSubMenu from '../SortFilterSubMenu.js';
import Text from '../misc/Text.js';
import Thumbnail from '../misc/Thumbnail.js';
import { YTNode } from '../../helpers.js';
class CommentsHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.titleText);
        this.count = new Text(data.countText);
        this.comments_count = new Text(data.commentsCount);
        this.create_renderer = Parser.parseItem(data.createRenderer);
        this.sort_menu = Parser.parseItem(data.sortMenu, SortFilterSubMenu);
        if (Reflect.has(data, 'customEmojis')) {
            this.custom_emojis = data.customEmojis.map((emoji) => ({
                emoji_id: emoji.emojiId,
                shortcuts: emoji.shortcuts,
                search_terms: emoji.searchTerms,
                image: Thumbnail.fromResponse(emoji.image),
                is_custom_emoji: emoji.isCustomEmoji
            }));
        }
    }
}
CommentsHeader.type = 'CommentsHeader';
export default CommentsHeader;
//# sourceMappingURL=CommentsHeader.js.map