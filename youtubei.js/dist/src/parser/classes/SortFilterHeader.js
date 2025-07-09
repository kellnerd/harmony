import { YTNode } from '../helpers.js';
import { Parser, YTNodes } from '../index.js';
class SortFilterHeader extends YTNode {
    constructor(data) {
        super();
        this.filter_menu = Parser.parseItem(data.filterMenu, YTNodes.SortFilterSubMenu);
    }
}
SortFilterHeader.type = 'SortFilterHeader';
export default SortFilterHeader;
//# sourceMappingURL=SortFilterHeader.js.map