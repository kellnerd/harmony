import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
import MenuNavigationItem from './MenuNavigationItem.js';
import MenuServiceItem from './MenuServiceItem.js';
class MenuPopup extends YTNode {
    constructor(data) {
        super();
        this.items = Parser.parseArray(data.items, [MenuNavigationItem, MenuServiceItem]);
    }
}
MenuPopup.type = 'MenuPopup';
export default MenuPopup;
//# sourceMappingURL=MenuPopup.js.map