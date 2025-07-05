import { YTNode } from '../helpers.js';
import { Parser } from '../index.js';
import Menu from './menus/Menu.js';
import Text from './misc/Text.js';
class EmergencyOnebox extends YTNode {
    constructor(data) {
        super();
        this.title = new Text(data.title);
        this.first_option = Parser.parseItem(data.firstOption);
        this.menu = Parser.parseItem(data.menu, Menu);
    }
}
EmergencyOnebox.type = 'EmergencyOnebox';
export default EmergencyOnebox;
//# sourceMappingURL=EmergencyOnebox.js.map