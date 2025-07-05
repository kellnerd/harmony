import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import ItemSectionTab from './ItemSectionTab.js';
import Text from './misc/Text.js';
class ItemSectionTabbedHeader extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.tabs = Parser.parseArray(data.tabs, ItemSectionTab);
        if (Reflect.has(data, 'endItems')) {
            this.end_items = Parser.parseArray(data.endItems);
        }
    }
}
ItemSectionTabbedHeader.type = 'ItemSectionTabbedHeader';
export default ItemSectionTabbedHeader;
//# sourceMappingURL=ItemSectionTabbedHeader.js.map