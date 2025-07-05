import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import MusicMultiSelectMenu from './menus/MusicMultiSelectMenu.js';
import Text from './misc/Text.js';
class MusicSortFilterButton extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title).toString();
        if (Reflect.has(data, 'icon')) {
            this.icon_type = data.icon.iconType;
        }
        this.menu = Parser.parseItem(data.menu, MusicMultiSelectMenu);
    }
}
MusicSortFilterButton.type = 'MusicSortFilterButton';
export default MusicSortFilterButton;
//# sourceMappingURL=MusicSortFilterButton.js.map