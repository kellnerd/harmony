import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Button from './Button.js';
import ChipCloud from './ChipCloud.js';
class SearchHeader extends YTNode {
    constructor(data) {
        super();
        this.chip_bar = Parser.parseItem(data.chipBar, ChipCloud);
        this.search_filter_button = Parser.parseItem(data.searchFilterButton, Button);
    }
}
SearchHeader.type = 'SearchHeader';
export default SearchHeader;
//# sourceMappingURL=SearchHeader.js.map