import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import NavigationEndpoint from './NavigationEndpoint.js';
import Text from './misc/Text.js';
class RichShelf extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.contents = Parser.parseArray(data.contents);
        this.is_expanded = !!data.is_expanded;
        this.is_bottom_divider_hidden = !!data.isBottomDividerHidden;
        this.is_top_divider_hidden = !!data.isTopDividerHidden;
        if ('endpoint' in data) {
            this.endpoint = new NavigationEndpoint(data.endpoint);
        }
        if ('subtitle' in data) {
            this.subtitle = new Text(data.subtitle);
        }
        if ('layoutSizing' in data) {
            this.layout_sizing = data.layoutSizing;
        }
        if ('icon' in data) {
            this.icon_type = data.icon.iconType;
        }
        this.menu = Parser.parseItem(data.menu);
        this.next_button = Parser.parseItem(data.nextButton);
        this.previous_button = Parser.parseItem(data.previousButton);
    }
}
RichShelf.type = 'RichShelf';
export default RichShelf;
//# sourceMappingURL=RichShelf.js.map