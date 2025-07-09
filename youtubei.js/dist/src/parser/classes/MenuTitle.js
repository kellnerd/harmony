import { YTNode } from '../helpers.js';
import { Text } from '../misc.js';
class MenuTitle extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
    }
}
MenuTitle.type = 'MenuTitle';
export default MenuTitle;
//# sourceMappingURL=MenuTitle.js.map