import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Text from './misc/Text.js';
import SearchFilterGroup from './SearchFilterGroup.js';
import ToggleButton from './ToggleButton.js';
class SearchSubMenu extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'title'))
            this.title = new Text(data.title);
        if (Reflect.has(data, 'groups'))
            this.groups = Parser.parseArray(data.groups, SearchFilterGroup);
        if (Reflect.has(data, 'button'))
            this.button = Parser.parseItem(data.button, ToggleButton);
    }
}
SearchSubMenu.type = 'SearchSubMenu';
export default SearchSubMenu;
//# sourceMappingURL=SearchSubMenu.js.map