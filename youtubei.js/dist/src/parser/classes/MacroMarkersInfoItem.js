import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
class MacroMarkersInfoItem extends YTNode {
    constructor(data) {
        super();
        this.info_text = new Text(data.infoText);
        this.menu = Parser.parseItem(data.menu, Menu);
    }
}
MacroMarkersInfoItem.type = 'MacroMarkersInfoItem';
export default MacroMarkersInfoItem;
//# sourceMappingURL=MacroMarkersInfoItem.js.map